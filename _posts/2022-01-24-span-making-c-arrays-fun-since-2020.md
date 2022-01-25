---
layout: post
title: Span - making C arrays fun since 2020
---
I just love [`std::span`](https://en.cppreference.com/w/cpp/container/span)! I've
written about it before [here](/using-span-with-argv) and
[here](/a-zero-cost-abstraction). Starting in C++20 our friend `span` lets us write
expressive code with little or no cost in standard C++.

And now I've learned that `span` can help us make C arrays safe, fun, and expressive
too!

## Are C arrays evil?

Let's face it, C arrays can be difficult to use properly. They don't carry around
information about their size that is available at run time, they decay to pointers
(which might be [C's biggest
mistake](https://digitalmars.com/articles/C-biggest-mistake.html)), and they are
notoriously difficult to get right in large code bases. As they get passed around
they can cause subtle security problems.

But they are also so simple and expressive, I really want to be able to use them
with confidence! That's where are friend `span` comes in.

## TL;DR

If you have a function that accepts a `span` to express the intent that the function
expects a continuous block of a fixed number of objects, passing a C array to that
argument might be the best option for code readability, expressiveness, and
performance.

You can find all of the code discussed in this post on Compiler Explorer
[here](https://godbolt.org/z/67brrqbfa).

## The setup

Suppose you have a function like this to process a list of points:

{% highlight c++ %}
struct Point { int x; int y; };

Point Process(span<Point> points){
  print("Processing {} points\n", points.size());
  Point result = {0, 0};
  for (auto& point : points) {
    result.x += point.x;
    result.y += point.y;
  }
  return result;
}
{% endhighlight %}

> These examples will use the [fmt](https://fmt.dev) library to print to standard
out.

This function sums the x and y values, and returns a `Point` containing the sum,
although the behavior of the `Process` function is not too important - we really care
about the functions that call it.

How could we feed information into that `Process` function? We'll try three
different approaches, and output the results like this:

{% highlight c++ %}
void display(Point point) {
  print("Point: ({}, {})\n", point.x, point.y);
}

int main() {
  display(UseVector());
  display(UseStdArray());
  display(UseCArray());
  return 0;
}
{% endhighlight %}

## First up - vector

By default, I always reach for `std::vector` when I need an container of contiguous
objects, or, really, any container. Is the best default option, efficient and
flexible. The code to feed our points to `Process` looks like this:

{% highlight c++ %}
Point UseVector() {
  {% raw %}vector<Point> input = {{1, 2}, {3, 4}, {5, 6}}; {% endraw %}
  return Process(input);
}
{% endhighlight %}

Use the Compiler Explorer link above to have a look at the assembly code GCC
generates at `-O2`:

{% highlight nasm linenos%}
UseVector():
        push    r12
        mov     edi, 24
        movabs  rax, 8589934593
        push    rbp
        sub     rsp, 72
        mov     QWORD PTR [rsp+32], rax
        movabs  rax, 17179869187
        mov     QWORD PTR [rsp+40], rax
        movabs  rax, 25769803781
        mov     QWORD PTR [rsp+48], rax
        mov     QWORD PTR [rsp], 0
        mov     QWORD PTR [rsp+8], 0
        mov     QWORD PTR [rsp+16], 0
        call    operator new(unsigned long)
        mov     rdx, QWORD PTR [rsp+48]
        mov     rbp, rax
        mov     QWORD PTR [rsp], rax
        mov     esi, 3
        movdqa  xmm0, XMMWORD PTR [rsp+32]
        lea     rax, [rax+24]
        mov     rdi, rbp
        mov     QWORD PTR [rbp+16], rdx
        movups  XMMWORD PTR [rbp+0], xmm0
        mov     QWORD PTR [rsp+16], rax
        mov     QWORD PTR [rsp+8], rax
        call    Process(std::span<Point, 18446744073709551615ul>)
        mov     rdi, rbp
        mov     esi, 24
        mov     r12, rax
        call    operator delete(void*, unsigned long)
        add     rsp, 72
        mov     rax, r12
        pop     rbp
        pop     r12
        ret
        mov     rbp, rax
        jmp     .L20
        mov     rbp, rax
        jmp     .L21
{% endhighlight %}

There is a lot going on here! Recall, we want to put six four-byte integers into
memory (or registers) and pass them to the `Process` function, along with
information that those integers make up three `Point` objects - that's it.

And eek! Check out the call to operator `new` on line 15 and operator `delete` on
line 31. The code is allocating memory from the heap for something that is
completely determined at compile time.

OK, so a vector might not be the best option here. Let's look at arrays.

## std::array vs. C array

The C++ code to use both `std::array` and a C array looks pretty similar to the
code for `std::vector`:

{% highlight c++ %}
Point UseStdArray() {
  {% raw %}array<Point, 3> input = {{{1, 2}, {3, 4}, {5, 6}}};{% endraw %}
  return Process(input);
}

Point UseCArray() {
  {% raw %}Point input[] = {{1, 2}, {3, 4}, {5, 6}};{% endraw %}
  return Process(input);
}
{% endhighlight %}

It is really cool that GCC generates the same assembly code for both of these
functions:

{% highlight nasm linenos%}
UseStdArray(): ; or, UseCArray():
        sub     rsp, 40
        mov     esi, 3
        movabs  rax, 8589934593
        mov     QWORD PTR [rsp], rax
        mov     rdi, rsp
        movabs  rax, 17179869187
        mov     QWORD PTR [rsp+8], rax
        movabs  rax, 25769803781
        mov     QWORD PTR [rsp+16], rax
        call    Process(std::span<Point, 18446744073709551615ul>)
        add     rsp, 40
        ret
{% endhighlight %}

And the code here looks much simpler. On line 3 we put the size of the array into a
register, then the following lines get the values on to the stack, and then make
call to `Process`. Short of computing the result at compile time (spoiler alert!)
this seems like the best we can do.

So which is better C++ code - `UseStdArray` or `UseCArray`?

First, check out the extra curly braces required for the `std::array` case. It
turns out there is some confusion among compilers about how this should work, with
[GCC at
least](https://stackoverflow.com/questions/8192185/using-stdarray-with-initialization-lists)
reporting an error when they are not there. They just add unnecessary visual
clutter, so I prefer a solution without them.

Second, we must indicate the size of the `std::array` in the code. In this case,
when the array is initialized with data so the information about the size is
repeated, and that can lead to problems. It seems better to [avoid mentioning the
size twice](https://quuxplusone.github.io/blog/2020/08/06/array-size/) at all.

The C array wins on both of these points - its initialization is simple as it can
be, and its size is inferred from the its initial value - cool! Then of course
inside `Process` the array becomes a `span`, so it is safe to iterate and use
without any worry about buffer overflows.

## But wait, there's more

Let's crank up the optimization level to `-O3` and see if that helps the
`std::vector`'s case here.

{% highlight nasm %}
UseVector():
        push    r12
        mov     edi, 24
        push    rbp
        push    rbx
        sub     rsp, 32
        movdqa  xmm0, XMMWORD PTR .LC1[rip]
        mov     rax, QWORD PTR .LC2[rip]
        movaps  XMMWORD PTR [rsp], xmm0
        mov     QWORD PTR [rsp+16], rax
        call    operator new(unsigned long)
        movdqa  xmm5, XMMWORD PTR [rsp]
        mov     edx, 4
        mov     rcx, rsp
        mov     rbp, rax
        mov     edi, OFFSET FLAT:.LC0
        mov     esi, 21
        mov     QWORD PTR [rsp], 3
        movups  XMMWORD PTR [rax], xmm5
        mov     rax, QWORD PTR [rsp+16]
        mov     QWORD PTR [rbp+16], rax
        call    fmt::v7::vprint(fmt::v7::basic_string_view<char>, fmt::v7::format_args)
        movdqu  xmm2, XMMWORD PTR [rbp+0]
        mov     eax, DWORD PTR [rbp+8]
        mov     rdi, rbp
        mov     esi, 24
        mov     edx, DWORD PTR [rbp+0]
        movq    xmm1, QWORD PTR [rbp+16]
        pshufd  xmm0, xmm2, 255
        movd    ecx, xmm0
        pshufd  xmm0, xmm2, 85
        add     edx, eax
        movd    eax, xmm0
        movd    xmm0, edx
        add     ecx, eax
        movd    xmm4, ecx
        punpckldq       xmm0, xmm4
        paddd   xmm0, xmm1
        movq    rbx, xmm0
        call    operator delete(void*, unsigned long)
        add     rsp, 32
        mov     rax, rbx
        pop     rbx
        pop     rbp
        pop     r12
        ret
        mov     r12, rax
        jmp     .L15
{% endhighlight %}

Well, `Process` was inlined into `UseVector`, but we still have heap allocation and
lots of computation. Compare this to the other `UseStdArray` and `UseCArray` (again
which compile to the same code):

{% highlight nasm %}
UseStdArray(): ; or, UseCArray():
        sub     rsp, 24
        mov     edx, 4
        mov     edi, OFFSET FLAT:.LC0
        mov     esi, 21
        mov     rcx, rsp
        mov     QWORD PTR [rsp], 3
        call    fmt::v7::vprint(fmt::v7::basic_string_view<char>, fmt::v7::format_args)
        add     rsp, 24
        movabs  rax, 51539607561
        ret
{% endhighlight %}

This looks much nicer. Now the code just passes the size of the array to the
`print` function and returns the result, which was computed at compile time! The
compiler can "see" through the initialization and remove all of the code for the
`Process` function.

## The real heroes

So like Samwise in Lord of the Rings, the real hero of this story is `std::span`,
which allows us to use the simplicity and expressiveness of C arrays in a safe way.

Oh, and of course your local neighborhood C++ compiler author (compilers are pretty
amazing).

## Edits

Reddit commenter elcapitaine helpfully [pointed
out](https://www.reddit.com/r/cpp/comments/sc152g/comment/hu4xano/?utm_source=share&utm_medium=web2x&context=3A)
that in C++20 there is a
[`std::to_array`](https://en.cppreference.com/w/cpp/container/array/to_array)
helper that makes the `UseStdArray` case nicer to write:

{% highlight c++ %}
Point UseStdArray() {
  {% raw %}auto input = to_array<Point>({{1, 2}, {3, 4}, {5, 6}});{% endraw %}
  return Process(input);
}
{% endhighlight %}

This looks much nicer than my code above - it does not list the array size twice
and avoids the odd double curly braces.
