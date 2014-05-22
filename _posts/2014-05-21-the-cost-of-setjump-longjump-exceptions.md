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

##The run-time cost of SJLJ exceptions##
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
        <td>0.00402 s</td>
        <td>0.01551 s</td>
    </tr>
</table>
</center>

So although there is a run-time cost for SJLJ exception handling, it not too significant. For most operations in Osoasso, exception handling is not a part of the code which performs the math, so SJLJ exception handling does not cause run-time overhead that will be noticeable.
