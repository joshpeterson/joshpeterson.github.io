---
layout: post
title: Use move semantics to avoid naming
---

I'll bet that most developers have experienced the application of [this](http://martinfowler.com/bliki/TwoHardThings.html) bit of wisdom at one time or another:

> There are only two hard things in Computer Science: cache invalidation and naming things.
>
> -- Phil Karlton

Indeed Michael Feathers [blogged](https://michaelfeathers.silvrback.com/when-it-s-okay-for-a-method-to-do-nothing) recently about the difficulty of naming a method that might do something. Since most code is read much more often than it is written, choosing the correct name for a method or a variable is extremely important. Good names can make complex code understandable, while bad names can leave even the simplest code nearly impenetrable.

##Don't even name it##
If a good name is valuable, then no name is priceless. Often I find myself writing code which uses object temporarily, but gives them names that out live their usefulness. Not only does this make code less readable, but it is down right dangerous.

Consider the following example, taken from Anthony Williams excellent book [*Concurrency in Action*](http://www.cplusplusconcurrencyinaction.com/):

{% highlight c++ %}
void f();
void might_throw() {
  std::thread t(f);
  // What if this throws?
  do_something_that_might_throw();
  t.join();
}
{% endhighlight %}

The C++11 threading library requires that either <code>join()</code> or <code>detach()</code> is called on a <code>std::thread</code> object. This code will not call either though, if <code>do_something_that_might_throw()</code> indeed does throw an exception. Williams comes to the rescue though with an RAII class to save the day.

{% highlight c++ %}
class guard {
  std::thread& t_;
public:
  explicit guard(std::thread& t): t_(t) {}
  ~guard() {
    if (t_.joinable()) t_.join();
  }
  guard(guard const&) = delete;
  guard& operator=(guard const&) = delete;
};
{% endhighlight %}

So the code in <code>might_throw()</code> above can now be written like this:

{% highlight c++ %}
void f();
void might_throw() {
  std::thread t(f);
  guard g(t);
  // No problems if this throws.
  do_something_that_might_throw();
  // t.join(); - no longer necessary
}
{% endhighlight %}

In this trivial example, it is easy to see that <code>t.join()</code> should not be called now. But in a more complex method that you might find in real code, it may not be clear to someone later that the call to join the thread is not necessary (and, in fact, dangerous).

##Find the temporary##
The fundamental problem here is that we have given a name (<code>t</code>) to an object that is really a temporary. By using the <code>guard</code> class to handle the lifetime of the thread, we have eliminated the need for the method which creates it to ever use it. So rather then refactoring the code to change the name of <code>t</code> to something like <code>t_do_not_use</code>, we can avoid giving the thread a name altogether. I would really like to do something like this:

{% highlight c++ %}
void f();
void might_throw() {
  guard g(std::thread(f)); // Reference to a temporary!
  // No problems if this throws.
  do_something_that_might_throw();
}
{% endhighlight %}

In C++98, this won't work, because the <code>guard</code> constructor is passed a reference to a temporary object. The C++11 standard introduced *move semantics*, which allow a temporary object to be moved instead of copied, so we can write this code (with a few changes to the <code>guard</code> class). After Williams mentions that a <code>std::thread</code> can be moved, he updates the RAII code like this:

{% highlight c++ %}
class guard {
  std::thread t_;
public:
  explicit guard(std::thread t): t_(std::move(t)) {
    if (!t_.joinable())
      throw std::logic_error("No thread");
  }
  ~guard() {
    t_.join();
  }
  guard(guard const&) = delete;
  guard& operator=(guard const&) = delete;
};
{% endhighlight %}

So now the calling code is safer. There is no name for the <code>std::thread</code> object, so it cannot be used incorrectly later in the method.

{% highlight c++ %}
void f();
void might_throw() {
  guard g(std::thread(f)); // Move the std::thread
  // No problems if this throws.
  do_something_that_might_throw();
}
{% endhighlight %}

So as a developer, I need to consider not only what I should name a variable, but even *if* I should name the variable. With move semantics in C++, it is now easier to be explicit about the context in which a given variable is used.
