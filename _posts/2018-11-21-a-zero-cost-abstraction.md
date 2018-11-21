---
layout: post
title: A zero cost abstraction?
---
Recently Joachim (CTO at Unity) has been talking about "performance by
default", the mantra that software should be as fast as possible from the outset.
This is driving the pretty cool stuff many at Unity are doing around things like
ECS, the C# job system, and Burst (find lots more about that
[here](https://unity3d.com/unity/features/job-system-ECS)).

One question Joachim has asked internally of Unity developers is (I'm paraphrasing
here): "What is the absolute lower bound of time this code could use?" This
strikes me as a really useful way to think about performance. The question changes
from "How fast is this?" to "How fast could this be?". If the answers to those two
questions are not the same, the next question is "Do we _really_ need the
additional overhead?"

Another way to think about this is to consider the zero-cost abstraction, a concept
much discussed in the C++ and Rust communities. Programmers are always building
abstractions, and those abstractions often lead to the difference between "how fast
it is" and "how fast it could be". We want to provide useful abstractions that
don't hurt performance.

## Reading some bytes

I was thinking about all of this recently while writing some code to read bytes
from a binary file. The first bit of code that rolled off my fingers was:

{% highlight c++ %}
uint8_t ReadByte();

void ReadBytes(uint8_t* buffer, size_t size)
{
  for (size_t i = 0; i < size; ++i)
      buffer[i] = ReadByte();
}
{% endhighlight %}

This feels like the "canonical" way to read bytes into a buffer. The API has no
abstraction - the function gets exactly what it needs: a pointer to some memory
location and the number of bytes to read into that memory location.

I ran clang-tidy on this code, and it was not happy:

```
binary_reader.cpp:20:5: error: do not use pointer arithmetic
[cppcoreguidelines-pro-bounds-pointer-arithmetic,-warnings-as-errors]
    buffer[i] = ReadByte();
```

At first this error was a bit confusing, but after staring at the code a bit, I
think I determined why clang-tidy doesn't like it: pointer arithmetic, while the
fastest way to address a buffer, is prone to errors. Specifically, the user of this
function can pass _any_ value for `size`. The function has no choice but to
dutifully write to memory where the client asked for it, so even a well-meaning
client who passes the wrong `size` can cause memory corruption.  We need an
abstraction which makes this function difficult to misuse.

## Enter the span

What options do we have for an interface to `ReadBytes` that makes it easy to pass
the size of the buffer correctly? Lets' list a few

1. `ReadBytes(std::vector<uint8_t>& buffer);`
2. `template<size_t N> ReadBytes(std::array<uint8_t, N>& buffer);`
3. `template<typename Iterator> ReadBytes(Interator begin, Iterator end);`

All of these will work, but they seem a bit restrictive of the client in different
ways. In addition, some of these APIs encode _more_ information than we really
need. All the client really wants to say is: "Here is a buffer I've set aside in
memory, please fill it up with bytes, thanks!"

Thankfully, there is an abstraction in C++20 for a collection of objects of a given
type, along with their size:
[`std::span`](https://en.cppreference.com/w/cpp/container/span). I'm not using
C++20 for this project, but I can use the same type from the GSL,
[`gsl::span`](https://github.com/Microsoft/GSL/blob/master/include/gsl/span). I
wrote a bit about span's cousin `gsl::multi_span` [earlier](/using-span-with-argv),
learning that it has a small, non-zero cost. I wanted to dive a bit deeper with
span.

The new implementation of `ReadBytes` looks like this:

{% highlight c++ %}
void ReadBytes(gsl::span<uint8_t> buffer)
{
  for (auto& value : buffer)
    value = ReadByte();
}
{% endhighlight %}

Better yet, I can call it with a number of different buffer types, all in a simple
way:

{% highlight c++ %}
std::array<uint8_t,8> buffer;
ReadBytes(buffer);

std::vector<uint8_t> buffer(8);
ReadBytes(buffer);

uint8_t buffer[8];
ReadBytes(buffer);
{% endhighlight %}

For each of these cases, the compiler infers the size of the buffer, so I don't
have to make sure I pass the proper size of the buffer. Problem solved!

## But at what cost?

Now we have a safe API to read bytes into a buffer, and we know the baseline
fastest way to read bytes into the buffer. If performance by default matters, we
need to know how much we pay for this safe abstraction.

One good way to understand the cost of code is to investigate the generated
assembly code, where there is _very_ little abstraction. Take a look at this
[comparison](https://godbolt.org/z/BdEqK5) (the first implementation is on the
left, the safe one is on the right).

The safe implementation only costs us one additional comparison instruction (line
15 on the right) at the start of the for loop. I think this is checking an error
condition, so I expect most of the time this branch will not be taken. I assume the
processor will notice that pretty quickly and optimize for the non-error case.

Note that we do pay a code size price for this abstraction as well. We have five
additional instructions here.

Lets measure the run time performance cost. It looks like it will be small, but can
we be sure? I wrote this benchmark:

{% highlight c++ %}
#include "binary_reader.h"
#include <benchmark/benchmark.h>
#include <vector>

static void ReadEightBytesRaw(benchmark::State& state)
{
  BinaryReader reader("../../../test/data/simple.wasm");
  for (auto _ : state)
  {
    uint8_t buffer[8];
    reader.ReadBytes(buffer, 8);
    benchmark::DoNotOptimize(buffer);
    reader.Reset();
  }
}

BENCHMARK(ReadEightBytesRaw);

static void ReadEightBytesSpan(benchmark::State& state)
{
  BinaryReader reader("../../../test/data/simple.wasm");
  for (auto _ : state)
  {
    uint8_t buffer[8];
    reader.ReadBytesSpan(buffer);
    benchmark::DoNotOptimize(buffer);
    reader.Reset();
  }
}

BENCHMARK(ReadEightBytesSpan);
{% endhighlight %}

And here are the results:

```
Running ./bench
Run on (8 X 2693.7 MHz CPU s)
CPU Caches:
L1 Data 32K (x4)
L1 Instruction 32K (x4)
L2 Unified 1024K (x4)
L3 Unified 33792K (x4)
Load Average: 0.08, 0.15, 0.13
----------------------------------------------------------
Benchmark                   Time           CPU Iterations
----------------------------------------------------------
ReadEightBytesRaw         365 ns        365 ns    1918628
ReadEightBytesSpan        364 ns        364 ns    1921003
```

Although much of the time in the benchmark is used opening and seeking in the
binary file, the profiler indicates the percent of time spent in the byte reading
code is nearly identical, with maybe slight advantage to the raw version, which
might not even be outside the margin of error.

So using `span` as an abstraction for an arbitrary length buffer to receive data
from a function provides:

1. A safe interface
2. A flexible interface
3. No cost over the best performing case

In this case, `span` gives us the API we want with performance by default.
