---
layout: post
title: Using gsl with argv
---
In the [layout](https://github.com/joshpeterson/layout) utility I need to do a
little bit of command line argument processing. When I used `argc` and `argv` as I
normally would, `clang-tidy` warned me about a violation of the [C++ Core
Guidelines](https://github.com/isocpp/CppCoreGuidelines). What is the proper way to
work with command line arguments and meet the core guidelines?

## The Problem

Here is the original code I wrote for `main`:

{% highlight c++ %}
int main(int argc, const char* argv[])
{
  if (argc < 2 || (argc == 2 && Equals(argv[1], "--help", "-h")))
  {
    PrintUsage();
    return 1;
  }

  return ComputeLayout(argv[1], TransformArguments(argc - 2, &argv[2]), std::cout);
}
{% endhighlight %}

This looks fine (and works), but `clang-tidy` warns that it the violates
[`cppcoreguidelines-pro-bounds-pointer-arithmetic`](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#Pro-bounds-arithmetic)
guideline.

{% highlight bash %}
warning: do not use pointer arithmetic [cppcoreguidelines-pro-bounds-pointer-arithmetic]
 if (argc < 2 || (argc == 2 && Equals(argv[1], "--help", "-h")))
                                      ^
warning: do not use pointer arithmetic [cppcoreguidelines-pro-bounds-pointer-arithmetic]
 return ComputeLayout(argv[1], TransformArguments(argc - 2, &argv[2]), std::cout);
                      ^
warning: do not use pointer arithmetic [cppcoreguidelines-pro-bounds-pointer-arithmetic]
 return ComputeLayout(argv[1], TransformArguments(argc - 2, &argv[2]), std::cout);
                                                             ^
{% endhighlight %}

## The solution

The C++ core guidelines indicate that we can use the `span` type from the
[GSL](https://github.com/Microsoft/GSL) library to safely do pointer arithmetic.
However, I found quickly that `span` requires the size of the array it wraps to be
known at compile time. That won't work for `argv`, as its size is given by `argc`,
and is only known at run time.

The GSL does have a type to handle this though, `multi_span`. It is like `span`,
but its size can be set at run time. So the `main` function using the GSL looks
like this:

{% highlight c++ %}
int main(int argc, const char* argv[])
{
  auto args = gsl::multi_span<const char*>(argv, argc);
  if (argc < 2 || (argc == 2 && Equals(args[1], "--help", "-h")))
  {
    PrintUsage();
    return 1;
  }

  return ComputeLayout(args[1], TransformArguments(args.last(argc - 2)), std::cout);
}
{% endhighlight %}

We can construct the `multi_span` from `argv` like this, passing its size in its
constructor.

{% highlight c++ %}
auto args = gsl::multi_span<const char*>(argv, argc);
{% endhighlight %}

Then we can use it like a normal array, with indexing operations. Notice that
`multi_span` has some nice accessors, like `last`, which returns a new `multi_span`
with only the last `n` elements. So it is very easy to prune the first two
arguments from `argv` and pass them to the `TransformArguments` function.

{% highlight c++ %}
return ComputeLayout(args[1], TransformArguments(args.last(argc - 2)), std::cout);
{% endhighlight %}

Also, since the `multi_span` includes the its size, no longer need to pass the
number of arguments to `TransformArguments`, which eliminates the possibility of
passing the wrong value.

Not only do `span` and `multi_span` help to clean up code, but they also eliminate
possible sources of bugs and make the code easier to read. We still get the ability
to use array indexers, so we have gained safety and expressiveness without
sacrificing anything. C++ Core Guidelines for the win!

## Not so fast, my friend

Did we really make this change without sacrificing anything? I would expect this
abstraction should come with some runtime cost.

Here is the [assembly code](https://godbolt.org/g/u12rjY) generated for the
original version of `main`, with direct pointer manipulation. The code is 414 lines
of assembly, and `main` itself is 103 lines long.

Here is the [source
code](https://gist.github.com/joshpeterson/f269c248ffacb05bdd88a84de96e22e9) for
the new version of `main` which uses the GSL `multi_span` type (I have prepended it
with all of the necessary headers from the GSL so that it will compile). This code
will compile to 450 lines of assembly, and `main` is 119 lines long (the code is
too large to work with a URL shortener, but you can paste the code from the Gist
into Godbolt directly).

So the new code with the GSL is _slightly_ larger. But the cost for the increased
expressiveness and safety is surprisingly small. In my opinion, the trade off is
warranted.

