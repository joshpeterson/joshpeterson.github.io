---
layout: post
title: All your state are belong to us
---
My colleague (Lucas Meijer)[https://twitter.com/lucasmeijer] was recently making changes to a rather complex bit of code in IL2CPP, the VTableBuilder class, when he tweeted this:

![A tweet about removing state](/static/images/all-your-base-are-belong-to-us/luces-tweet.png)

 I added the rather unoriginal response "All your state are belong to us."

![All your base are belong to us](/static/images/all-your-base-are-belong-to-us/all-your-base.png)

This started me thinking though, could it be true that our programs have been overrun with mutable state? Is mutable state something like an invading alien army, which has taken control? The code Lucas was modifying solves a complex problem in IL2CPP (it generates a representation of the vtable for a class in managed code that is used in the native translation of the code). But is that code more complex than necessary, due to mutable state?

More to the point, I wanted to answer the following questions:

* What is *problematic* mutable state?
* How do we correct problems with mutable state now?
* Why can functional code solve the problems with mutable state?

##What is mutable state?##

I think that mutable state is relatively easy to define.

**Mutable state**: A sequence of bits stored in some type of memory (e.g. registers, non-volatile memory, volatile memory) which is written by one instruction and read by another instruction.

Usually, we introduce mutable state with an assignment operator. For example:

{% highlight c++ %}
int answer = 42; // mutable state
{% endhighlight %}

But all mutable state is not problematic. Variables must have some value, otherwise we would not use them so prevalently. Instead, we should define *promlematic* mutable state.

**Problematic mutable state**: Mutable state which is stored at a scope larger than a single function.
