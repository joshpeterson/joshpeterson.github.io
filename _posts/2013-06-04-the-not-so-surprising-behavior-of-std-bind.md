---
layout: post
title: The (not so) surprising behavior of std::bind
---

Often when I am unit testing a method which accepts a function pointer, I first write a simple test to verify that the point-to-function is called. The C++11 standard has added <a href="http://en.cppreference.com/w/cpp/utility/functional/bind"><code>std::bind</code></a> to easily create function pointers. When I used <code>std::bind</code> in a recent project, I discovered what I thought was surprising behavior. After a bit more investigation, I found that the behavior is not so surprising at all, and in fact provides some useful flexibility.

## To Copy or Not to Copy
I've recently been writing some code which implements a simple map-reduce algorithm using MPI. The constructor for the map-reduce implementation class is defined like this:

{% highlight c++ %}
MpiMapReduce(
  IteratorType begin, IteratorType end,
  function<vector<pair<IteratorType, IteratorType>>
    (IteratorType, IteratorType, int)> partitioning_method,
  int number_of_threads)
{% endhighlight %}

The first thing I would expect the <code>map()</code> method to do is call the provided partitioning method to partition the range of iterators. So I wrote a simple class to allow a unit test to determine if the partitioning method was called.

{% highlight c++ %}
class PartitioningTracker
{
public:
  PartitioningTracker() : partitioning_method_called_(false)
  {}

  vector<pair<vector<int>::iterator, vector<int>::iterator>>
  partition(vector<int>::iterator begin,
            vector<int>::iterator end,
            int number_of_partitions)
  {
      partitioning_method_called_ = true;
      return vector<pair<vector<int>::iterator,
                         vector<int>::iterator>>();
  }

  bool GetPartitioningMethodCalled() const
  {
      return partitioning_method_called_;
  }

private:
  bool partitioning_method_called_;
};
{% endhighlight %}

Then in the unit test, I used <code>std::bind</code> to bind the to <code>partition</code> member function like this:

{% highlight c++ %}
PartitioningTracker tracker;
auto partitioning_method =
  bind(&PartitioningTracker::partition,
       tracker, placeholders::_1,
       placeholders::_2, placeholders::_3)_;
{% endhighlight %}

To my surprise, I found that the partitioning method was never called. At least, the <code>GetPartitioningMethodCalled()</code> method always returned false. It wasn't until I added a copy constructor to the <code>PartitioningTracker</code> class that I discovered the problem.

## With Great Power Comes Great Responsibility

[This](http://stackoverflow.com/questions/15264003/using-stdbind-with-member-function-use-object-pointer-or-not-for-this-argumen) answer on Stack Overflow helped to determine the cause of this behavior. It turns out that <code>std::bind</code> has a number of overloads. The one I chose made a copy of the tracker object. So although my code in the <code>map()</code> method was indeed calling the partitioning method, it was calling the method on an instance of <code>PartitionTracker</code> which existed solely for the purpose of the <code>std::bind</code> call, not on the instance of <code>PartitionTracker</code> I had created. When my unit test asserted that <code>GetPartitioningMethodCalled()</code> returned true, it failed!

Changing the test code to pass the address of the locally created <code>PartitionTracker</code> instance solved the problem.

{% highlight c++ %}
PartitioningTracker tracker;
auto partitioning_method =
  bind(&PartitioningTracker::partition,
       &tracker, placeholders::_1,
       placeholders::_2, placeholders::_3)_;
{% endhighlight %}

## The Full Story

To get a better idea of how the various overloads of <code>std::bind</code> work, I wrote a simple test program.

<script src="https://gist.github.com/joshpeterson/5710863.js"></script>

This program will output the following:

<pre>
Bound to copy of tracker
	Method called
	_methodCalled value: false
Bound to local instance of tracker
	Method called
	_methodCalled value: true
Bound to refrence to tracker
	Method called
	_methodCalled value: true
</pre>

In all three cases, the method is called as expected, but only the final two cases call the method on the local instance of <code>Tracker</code> class. You can see the code execute on Ideone [here](http://ideone.com/jQ6XBK).

In hindsight, this behavior should not have been surprising. C++ uses value semantics to pass arguments by default, so it should have been clear why my unit test was not working as expected initially. In fact, this behavior provides maximum flexibility, allowing the caller of <code>std::bind</code> to use it as he or she pleases.




