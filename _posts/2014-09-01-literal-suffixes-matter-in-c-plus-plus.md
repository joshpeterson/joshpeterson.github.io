---
layout: post
title: Literal suffixes matter in C++
---
As I was debugging a problem in some C++ code last week, I couldn't help thinking about Gary Bernhardt's ["Wat"](https://www.destroyallsoftware.com/talks/wat) lightning talk. Sometimes, I run across problems that seem so inconceivable, Wat!?!? is the only appropriate reaction. After a colleague pointed out the oddly simple solution to this problem (it is the proper use of a literal suffix), I learned something new about C++ that I wanted to share.

## What does this code print?##
Here is the seemingly simple code that did not work as I expected:

{% highlight c++ %}
#include <iostream>
#include <cstdint>

int main() {
  int64_t wat = -2147483648;
  std::cout << wat << std::endl;

  return 0;
}
{% endhighlight %}

Now compile and run this code (I used Visual Studio 2013):

    C:\>cl /nologo /EHsc wat.cpp
    wat.cpp
    C:\>wat.exe
    2147483648 <-- Wat!?!?

Is this a bug in the compiler? Why did it print a positive value when I explicitly set the value of the `wat` variable to a negative value? Let's try something else:

{% highlight c++ %}
#include <iostream>
#include <cstdint>

int main() {
  int64_t wat = -2147483648;
  int32_t wat_32 = -2147483648;
  std::cout << "wat: " << wat << std::endl;
  std::cout << "wat_32: " << wat_32 << std::endl;

  return 0;
}
{% endhighlight %}

    C:\>cl /nologo /EHsc wat.cpp
    wat.cpp
    C:\>wat.exe
    wat: 2147483648 <-- Wat!?!?
    wat_32: -2147483648 <-- !(Wat!?!?)

How are these two assignments different? The 32-bit integer looks like I would expected, but the 64-bit integer is still wrong. Let's look at the actual bits (via hexadecimal):

{% highlight c++ %}
#include <iostream>
#include <cstdint>

int main() {
  int64_t wat = -2147483648;
  int32_t wat_32 = -2147483648;
  std::cout << "wat: " << "0x" << std::hex << wat << std::endl;
  std::cout << "wat_32: " << "0x" << std::hex << wat_32 << std::endl;

  return 0;
}
{% endhighlight %}

    C:\>cl /nologo /EHsc wat.cpp
    wat.cpp
    C:\>wat.exe
    wat: 0x80000000
    wat_32: 0x80000000

My initial response to this output was **Wat!?!?!?!?!?!** After that mental outburst, it was time to ask my colleagues:

> <pre>me: Wat!?!?
colleague: Try a suffix.
me: A what?
colleague: LL
me: Oh, yeah</pre>

So, I tried a suffix:

{% highlight c++ %}
#include <iostream>
#include <cstdint>

int main() {
  int64_t wat = -2147483648LL;
  int32_t wat_32 = -2147483648;
  std::cout << "wat: " << std::dec << wat << " 0x" << std::hex << wat << std::endl;
  std::cout << "wat_32: " << std::dec << wat_32 << " 0x" << std::hex << wat_32 << std::endl;

  return 0;
}
{% endhighlight %}

to which the compiler dutifully responded:

    C:\>cl /nologo /EHsc wat.cpp
    wat.cpp
    C:\>wat.exe
    wat: -2147483648 0xffffffff80000000
    wat_32: -2147483648 0x80000000

Now the cause of the problem was clear. Without the literal suffix `LL` the compiler was *correctly* zero extending the 32-bit integer literal value `-2147483648` to 64-bits which actually has a value of `2147483648`. I had to explicitly tell the compiler that I want to treat the literal as a 64-bit integer using the `LL` suffix.

## Who writes code like this?##
This looks like a contrived example, but it really wasn't. The value `-2147483648` happens to be the minimum value of a 32-bit integer minus 1. I'm working on the team building [il2cpp](http://blogs.unity3d.com/2014/05/20/the-future-of-scripting-in-unity/), and I was implementing the IL opcode [`conv.ovf.i4`](http://msdn.microsoft.com/en-us/library/system.reflection.emit.opcodes.conv_ovf_i4.aspx), which attempts to convert a value on the stack to a 32-bit signed integer, and throws an exception if the value is too great. During that process, I discovered that the code generated for the [`ldc.i8`](http://msdn.microsoft.com/en-us/library/system.reflection.emit.opcodes.ldc_i8.aspx) opcode wasn't working as expected.

The `ldc.i8` opcode loads a given 64-bit integer onto the evaluation stack. The C++ code generated by il2cpp for the `ldc.i8` instruction looked like this:

{% highlight c++ %}
int64_t L_20_System_Int64 = -2147483648;
{% endhighlight %}

I could see in the C++ debugger that the value in the `L_20_System_Int64` variable was not correct. Indeed, the lack of a literal suffix was the cause. After a simple change to the il2cpp code generation method for `ldc.i8`, the correct C++ code was generated, and the `conv.ovf.i4` test worked as expected.

## Literal suffixes do matter##
I was surprised to see the effort in C++11 to get [user-defined literal suffixes](http://en.cppreference.com/w/cpp/language/user_literal) into the standard. After this experience though, I have a new found respect for these seemingly innocuous characters, and the importance they can play in the correct execution of a program.