---
layout: post
title: The curious case of cltq
---

While debugging a problem in some C code recently, I ran across an assembly
instruction causing problems for a function return value. The culprit: `cltq`. I'd
never seen this instruction before, and it was the cause a serious problem for a
function returning a pointer I had just written.

## The code

The code I was writing was spread across two functions. Here is a simplified
version of it:

**other.c:**

{% highlight c %}
#include <stdio.h>

void* ReturnsAPointer()
{
  void* value = (void*)0x000000BADBADF00D;
  printf("In ReturnsAPointer the pointer is %p\n", value);
  return value;
}
{% endhighlight %}

**main.c:**

{% highlight c %}
#include <stdio.h>

int main(int argc, char* argv[])
{
  void* value = ReturnsAPointer();
  printf("In main the pointer is %p\n", value);
  return 0;
}
{% endhighlight %}

I compiled the files like this:

{% highlight bash %}
$ gcc main.c other.c -o wat
{% endhighlight %}

Then when I ran the executable, this happened:

{% highlight bash %}
$ ./wat
In ReturnsAPointer the pointer is 0xbadbadf00d
In main the pointer is 0xffffffffdbadf00d
{% endhighlight %}

Why is the pointer returned to `main` incorrect? Notice that it is not totally
wrong, just _mostly_ wrong (which is still wrong enough when it comes to pointers).
 These are the two values in binary:

{% highlight bash %}
0000000000000000000000001011101011011011101011011111000000001101
1111111111111111111111111111111111011011101011011111000000001101
      <-- 32 bits are different ^ 32 bits are the same -->
{% endhighlight %}

The high 32-bits of the pointer (I was compiling this on a 64-bit processor) are
all 1's after being returned from the function. This calls for a look at the
assembly code!

## The assembly code

Let's generate the assembly code here to see what is really happening:

{% highlight bash %}
$ gcc -S main.c other.c
{% endhighlight %}

Here is the relevant part of the `main` function, where it calls `ReturnsAPointer`:

{% highlight c-objdump%}
movl    $0, %eax
call    ReturnsAPointer
cltq
movq    %rax, -8(%rbp)
{% endhighlight %}

Everything looks good until that odd `cltq` instruction appears. What is it doing
there? [Stack Overflow](http://stackoverflow.com/a/10715049/381697) to the rescue!
I never forward declared the `ReturnsAPointer` method, so GCC assumed the return
value was `int`. Therefore, the 64-bit pointer return value was treated as a 32-bit
int that needs to be extended to 64 bits, so `cltq` is the correct instruction. It
widens a 32-bit value to 64 bits, filling in the upper 32 bits with the value in
the highest bit of the lower 32 bits.

Intel assembly has a number of [similar instructions](http://www.cwde.de/) that
might be used instead of `cltq` in cases like this. The are `cbw`, `cwde`, and
`cdqe`. The solution to any of these cases is to forward declare the
`ReturnsAPointer` function, so the compiler can know the proper type of its return
value.

## The rest of the story

I wasn't totally honest above. It turns out that this behavior is not nearly as
surprising as I first thought it was. Here is the _complete_ output of the compile
step I showed earlier:

{% highlight bash %}
$ gcc main.c other.c -o wat
main.c: In function ‘main’:
main.c:5:17: warning: initialization makes pointer from integer without a cast
[enabled by default]
   void* value = ReturnsAPointer();
{% endhighlight %}

GCC is clearly indicating the exact problem via a warning. Unfortunately, the code
I was using causes lots of warnings when it is compiled, so I missed this one and
cost myself some debugging time. The moral of this story is: compile without
warnings if at all possible.
