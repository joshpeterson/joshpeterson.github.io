---
layout: post
title: The cost of set-jump long-jump exceptions
---
Last year Google [announced](https://groups.google.com/forum/#!topic/native-client-discuss/0spfg6O04FM) support for C++ exceptions in the PNaCL tool chain of their [Native Client](https://developer.chrome.com/native-client/overview) technology. Since my experimental project [Osoasso](https://github.com/joshpeterson/osoasso) uses exceptions for some error handling, this was excellent news. I decided to start working to build my project using PNaCL. However, I was intrigued by this statement in the announcement:

> As before C++ exception handling is off by default, to ensure better 
performance and smaller code size. It is possible to use set-jump 
long-jump exception handling on stable pexes with the 
--pnacl-exceptions=sjlj compiler flag. Full zero-cost exceptions are 
currently only supported for unstable pexes...

I was unfamiliar with the concept of set-jump long-jump exception handling, and I wondered why it had some cost associated with it. Here I'll attempt to explain that cost.

##What is set-jump long-jump exception handling?##
Set-jump long-jump exception handling is a simple method of exception implementation that uses the C methods `setjmp` and `longjmp` (or something like them). The `setjmp` method is used to store all of the processor state at a given location, and the `longjmp` method is used used to return to that processor state and location if necessary. In LLVM (which is used for the PNaCL implementation), the [`llvm.eh.sjlj.setjmp`](http://llvm.org/docs/ExceptionHandling.html#llvm-eh-sjlj-setjmp) and [`llvm.eh.sjlj.longjmp`](http://llvm.org/docs/ExceptionHandling.html#llvm-eh-sjlj-longjmp) intrinsics are used.

This type of exception handling is not considered zero-cost, since some additional code must be executed for each `try` block or `throw` statement, even if the no exception occurs. As the LLVM exception handling [documentation](http://llvm.org/docs/ExceptionHandling.html) states:

> ...SJLJ exception handling builds and removes the unwind frame context at runtime. This results in faster exception handling at the expense of slower execution when no exceptions are thrown. As exceptions are, by their nature, intended for uncommon code paths, DWARF exception handling is generally preferred to SJLJ.

##How can exceptions be enabled with PNaCL?##
Exception handling can be enabled with PNaCL at compile and link time use the `--pnacl-exceptions=sjlj` flag. This flag must be passed to both the compiler and the linker. So in my Makefile, I have the following lines:

{% highlight Makefile %}
CFLAGS = -Wall -Wno-long-long -pthread -Werror -std=gnu++11 -O2 --pnacl-exceptions=sjlj
LDFLAGS = --pnacl-exceptions=sjlj

...

$(eval $(call LINK_RULE,$(TARGET)_unstripped,$(SOURCES),$(LIBS),$(DEPS),$(LDFLAGS)))
{% endhighlight %}

I spent a good bit of time wondering why the code in the first two lines did not work initially. Then I later realized that the `LDFLAGS` variable was not being passed to the `LINK_RULE` by default. I had to manually add it!

In addition, I can run unit tests independently of Chrome by using `pnacl-translate` to generate a platform-specific .nexe file:

```
%NACL_SDK_ROOT%\toolchain\win_pnacl\bin\pnacl-translate -arch x86-32 %TOOLCHAIN%\Release\osoasso_test.pexe -o %TOOLCHAIN%\Release\osoasso_test_x86_32.nexe
```

##What is the cost of SJLJ exceptions?##
First, I measured the cost of SJLJ exceptions in two ways:

1. Compile time
2. Executable size

The following table shows the data for both of these cases with and without exceptions.

<center>
<table class="gridtable">
    <tr>
        <th></th>
        <th>Without Exceptions</th>
        <th>With SJLJ Exceptions</th>
    </tr>
    <tr>
        <td>Compile time</td>
        <td>2m 54 s</td>
        <td>3m 1s</td>
    </tr>
    <tr>
        <td>Executable size</td>
        <td>394,000 bytes</td>
        <td>583,748 bytes</td>
    </tr>
</table>
</center>

The most important cost of these exceptions is executable size. Since Osoasso is distributed via the web, every extra byte matters, since it is an extra byte the user will have to download, and extra time the user will wait to begin using the application.

##What is the run-time cost of SJLJ exceptions?##
To measure the run-time cost of SJLJ exceptions, I wanted to execute some code that includes `throw` statements but does not actually throw any exceptions. Also, the time to execute the code to perform the actual math should not be too significant, so it will not trump the exception handling code. I choose to use the `add` command to add two 100x100 matrices. This code throws exceptions if the matrices are not of the correct size.

{% highlight c++ %}
if (left->rows() != right->rows()) {
  std::stringstream message;
  message << "Matrices do not have the same number of rows"
          << " left: " << left->rows() 
          << " right: " << right->rows();
  throw std::invalid_argument(message.str());
}
else if (left->columns() != right->columns()) {
  std::stringstream message;
  message << "Matrices do not have the same number of columns"
          << " left: " << left->columns() 
          << " right: " << right->columns();
  throw std::invalid_argument(message.str());
}
{% endhighlight %}

<center>
<table class="gridtable">
    <tr>
        <th></th>
        <th>Without Exceptions</th>
        <th>With SJLJ Exceptions</th>
    </tr>
    <tr>
        <td>Time to add matrices</td>
        <td>0.01317 s</td>
        <td>0.01551 s</td>
    </tr>
</table>
</center>

So although there is a run-time cost for SJLJ exception handling, it not too significant. For most operations in Osoasso, exception handling is not a part of the code which performs the math, so SJLJ exception handling does not cause run-time overhead that will have a significant impact.

##How are SJLJ exceptions implemented?##
To better understand why this exception handling scheme has any run-time cost for the non-exceptional path, I decided to investigate the implementation details.

The normal build for PNaCL generates a LLVM bitcode file and a .pexe file. Following the instructions [here](http://www.chromium.org/nativeclient/pnacl/experimenting-with-generated-bitcode) I was able to generate a human-readable text file of the LLVM bit code using this command:

```
%NACL_SDK_ROOT%\toolchain\win_pnacl\bin\pnacl-dis osoasso_unstripped.bc
```

As an example, I took a look at the generated code for the [`jacobi_eigen_solver`](https://github.com/joshpeterson/osoasso/blob/master/src/jacobi_eigen_solver.cc) command, which requires that its input matrix be symmetric. The section of the code which makes this check looks like this:

{% highlight c++ %}
transpose transpose_command;
auto input_transpose = transpose_command.call(input, 1);
if (*input != *input_transpose)
    throw std::invalid_argument("The input matrix is not a symmetric matrix. This command requires a symmetric matrix.");
{% endhighlight %}

Unfortunately, the generated LLVM bitcode for even this simple example is rather large, so I'll attempt to summarize it.

Without exceptions enabled, these lines represent the `if` check in C++:

{% highlight LLVM %}
%22 = icmp ult i64 %sub7.i.off.i.i, 9, !dbg !270096
%inc.i.i = add i32 %j.037.i.i, 1, !dbg !270070
tail call void @llvm.dbg.value(metadata !{i32 %inc.i.i}, i64 0, metadata !270097), !dbg !270070
br i1 %22, label %for.cond7.i.i, label %if.then, !dbg !270068
{% endhighlight %}

Here the [`icmp`](http://llvm.org/docs/LangRef.html#icmp-instruction) instruction is performing the comparison and the [`br`](http://llvm.org/docs/LangRef.html#br-instruction) instruction actually branches to the exceptional path if the value in `%22` is false. The exceptional path is in the `if.then` label, where eventually the code will call `abort` because exception handling is disabled. Note however that the non-exceptional path requires no additional instructions. All of the exception handling code in this case is on the exceptional path.
