---
layout: post
title: Defining define
---

When I encounter a preprocessor branch in code I usually find myself struggling to
recall the difference between `#if`, `#ifdef`, and `#if defined`. This post is an
attempt to provide myself with a quick reference. Hopefully it might help others as
well.

This chart summarizes things:

<center>
<table class="gridtable">
    <tr> <td></td> <th>Checks for existence</th> <th>Numeric defines</th> <th>Supports <code>&&</code> and <code>||</code></th> <th> Supports <code>!</code></th></tr>
    <tr> <th><code>#if</code></th> <td>No</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr>
    <tr> <th><code>#ifdef</code></th> <td>Yes</td> <td>No</td> <td>No</td> <td>One condition (<code>#ifndef</code>)</td> </tr>
    <tr> <th><code>#if defined</code></th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Many conditions (<code>!defined()</code>)</td> </tr>
</table>
</center>
<p></p>

The details are below.

## Start with `#if`

Let's start with this code:

{% highlight c++ %}
#define DEFINED_VALUE

#if DEFINED_VALUE
#warning "#if DEFINED_VALUE" is active
#else
#warning "#if DEFINED_VALUE" is not active
#endif
{% endhighlight %}

It produces a compiler error:

{% highlight bash %}
test.cpp:3:18: error: expected value in expression
#if DEFINED_VALUE
{% endhighlight %}

So to use `#if`, we need to have an actual value, like this.

{% highlight c++ %}
#define DEFINED_VALUE 0
{% endhighlight %}

{% highlight bash %}
test.cpp:6:2: warning: "#if DEFINED_VALUE" is not active
{% endhighlight %}

Then a non-zero value will "activate" the branch.

{% highlight c++ %}
#define DEFINED_VALUE 1
{% endhighlight %}

{% highlight bash %}
test.cpp:6:2: warning: "#if DEFINED_VALUE" is active
{% endhighlight %}

It is also possible to use `#if` for logical conditions like `&&` and `||`.

{% highlight c++ %}
#define ZERO 0
#define ONE 1

#if ONE && ONE
#warning 1 and 1 is active
#endif

#if ONE || ZERO
#warning 1 or 0 is active
#endif
{% endhighlight %}

{% highlight bash %}
test.cpp:5:2: warning: 1 and 1 is active
test.cpp:9:2: warning: 1 or 0 is active
{% endhighlight %}

## Next up: `#ifdef`

Now let's try `#ifdef`.

{% highlight c++ %}
#define DEFINED_VALUE

#ifdef DEFINED_VALUE
#warning "#ifdef DEFINED_VALUE" is active
#else
#warning "#ifdef DEFINED_VALUE" is not active
#endif
{% endhighlight %}

{% highlight bash %}
test.cpp:4:2: warning: "#ifdef DEFINED_VALUE" is active
{% endhighlight %}

So just the presence of the defined value will activate this branch. We can comment
it out to deactivate it.

{% highlight c++ %}
//#define DEFINED_VALUE
{% endhighlight %}

{% highlight bash %}
test.cpp:6:2: warning: "#ifdef DEFINED_VALUE" is not active
{% endhighlight %}

We can use `#ifndef` to determine if a value is _not_ defined.

{% highlight c++ %}
#define DEFINED_VALUE

#ifndef DEFINED_VALUE
#warning "#ifndef DEFINED_VALUE" is active
#else
#warning "#ifndef DEFINED_VALUE" is not active
#endif
{% endhighlight %}

{% highlight bash %}
test.cpp:6:2: warning: "#ifndef DEFINED_VALUE" is not active
{% endhighlight %}

Can we do Boolean operations, as with `#if`?

{% highlight c++ %}
#define ZERO 0
#define ONE 1

#ifdef ONE && ZERO
#warning 1 and 0 is active
#else
#warning 1 and 0 is not active
#endif
{% endhighlight %}

{% highlight bash %}
test.cpp:4:12: warning: extra tokens at end of #ifdef directive
#ifdef ONE && ZERO
test.cpp:5:2: warning: 1 and 0 is active
{% endhighlight %}

No, it seems Boolean conditions are not possible here. Even worse, we only get a
warning, and the condition is evaluated as if the `#ifdef` is true! In this case,
the actual behavior is the opposite of my intuition. This could be lost in a sea of
warnings, and end up being difficult to track down.

In addition, numeric values are only checked for existence.

{% highlight c++ %}
#define ZERO 0

#ifdef ZERO
#warning "#ifdef ZERO" is active
#else
#warning "#ifdef ZERO" is not active
#endif
{% endhighlight %}

{% highlight bash %}
test.cpp:4:2: warning: "#ifdef ZERO" is active
{% endhighlight %}

So maybe surprisingly, the behavior of `#ifdef ZERO` and `#if ZERO` are opposite.

## Last but not least: `#if defined`

Finally, we can use the `defined` keyword, which something like a function call.

{% highlight c++ %}
#define DEFINED_VALUE

#if defined(DEFINED_VALUE)
#warning "#if defined(DEFINED_VALUE)" is active
#else
#warning "#if defined(DEFINED_VALUE)" is not active
#endif
{% endhighlight %}

{% highlight bash %}
test.cpp:4:2: warning: "#if defined(DEFINED_VALUE)" is active
{% endhighlight %}

If the value is not defined, we get the other leg of the branch:

{% highlight c++ %}
//#define DEFINED_VALUE
{% endhighlight %}

{% highlight bash %}
test.cpp:6:2: warning: "#if defined(DEFINED_VALUE)" is not active
{% endhighlight %}

We can also check for a value that is not defined.

{% highlight c++ %}
//#define DEFINED_VALUE

#if !defined(DEFINED_VALUE)
#warning "#if !defined(DEFINED_VALUE)" is active
#else
#warning "#if !defined(DEFINED_VALUE)" is not active
#endif
{% endhighlight %}

{% highlight bash %}
test.cpp:4:2: warning: "#if !defined(DEFINED_VALUE)" is active
{% endhighlight %}

If addition, this syntax supports Boolean operators (`&&`, `||`, and `!`):

{% highlight c++ %}
#define DEFINED

#if defined(DEFINED) && !defined(UNDEFINED)
#warning "#if defined(DEFINED) && !defined(UNDEFINED)" is active
#else
#warning "#if defined(DEFINED) && !defined(UNDEFINED)" is active
#endif
{% endhighlight %}

{% highlight bash %}
test.cpp:4:2: warning: "#if defined(DEFINED) && !defined(UNDEFINED)" is active
{% endhighlight %}

What about numeric values though?

{% highlight c++ %}
#define ZERO 0

#if defined(ZERO)
#warning "#if defined(ZERO)" is active
#else
#warning "#if defined(ZERO)" is not active
#endif
{% endhighlight %}

{% highlight bash %}
test.cpp:4:2: warning: "#if defined(ZERO)" is active
{% endhighlight %}

The behavior of `#if defined` is the same as the behavior of `#ifdef` in this
respect.
