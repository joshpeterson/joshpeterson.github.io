---
layout: post
title: A trade-off between generalization and performance
---
As a software developer, I am trained to look for generalizations. Much of my time is spent attempting to translate abstractions of concepts into concrete source code so they can be compiled and executed. This process always involves some level generalization (which is most of the fun). Often though, I've found that a generalization which makes sense for a given concept can lead to significant performance problems. A generalization is, after all, a leaky abstraction of some specific case. I try to create abstractions that don't leak important information, but sometimes they do.

## Iterators Everywhere
The iterator pattern is one very useful abstraction. I have [used](https://github.com/joshpeterson/osoasso/blob/master/include/parallel_task.h) it to write a pthread-based map-reduce algorithm, and I have [used](https://github.com/joshpeterson/Nash/blob/master/TRPMONashCategorizationParallel.h) it to interact with the Intel Thread Building Blocks map-reduce implementation as well. So when I started to write an MPI-based map-reduce algorithm, I adopted the familiar iterator pattern. The constructor for my map-reduce implementation looked something like this (I've omitted a few unimportant details):

{% highlight c++ %}
MpiMapReduce(TaskType& task,
             IteratorType begin, IteratorType end,
             int number_of_threads)
{% endhighlight %}

Here TaskType and IteratorType are template arguments. As with most abstractions, the iterator pattern is a bit leaky. It assumes that the data to be iterated is stored in some location accessible to the iterator, but independent of the iterator. As long as the iterators are used in the same process as the data, this works well. For MPI though, this leaked detail becomes important.

In order to get the information about the elements of the container between the <code>begin</code> and <code>end</code> iterators for each partition of the data to other MPI processes, that data must be explicitly sent to the other processes. In an application which uses MPI, data transfer between processes can often become a significant performance bottleneck, limiting the ability of the implementation to scale to many processes. In the general case, it may be necessary to send all of the data from the container between the <code>begin</code> and <code>end</code> iterators for a given partition, since that is often the data which the other process needs to use to obtain its result.

Suppose that instead of exposing data stored in a container, the iterators expose data generated via an iterative algorithm.

## Not Your Standard Iterator
The iterator I'm using in this Nash solution search application is an iterator over a generative algorithm, so it has no container of stored data backing it. In fact, each iterator of this algorithm can be serialized to a single integer. So a general map-reduce implementation like the one I originally wrote above would generate the value at each iterator between begin and end, send that data (one integer per iterator) via MPI to another process, then use each integer to generate the data from the algorithm again, and provide it to the task!

To avoid the cost of generating the value for each iterator twice and sending far more data than necessary to each process, I could have <code>MpiMapReduce</code> simply send the <code>begin</code> and <code>end</code> iterator for each partition to each MPI process. This would work well for generative iterators, but not for container-based iterators. The interface provided above indicates that any iterator will do, so it should be changed.

## Say What You Mean, Mean What You Say
As a developer, I like the generalization provided by the iterator pattern. It allows me to re-use the <code>MpiMapReduce</code> algorithm in many cases by separating the data to be operated on from the algorithm to operate on it. Since this generalization leaks some information about the way the iterator is implemented, and the use of that information allows a significant performance improvement, the generalization might be too costly.

A better interface makes the intention of the code more explicit:

{% highlight c++ %}
MpiMapReduce(TaskType& task,
             int begin, int end,
             int number_of_threads)
{% endhighlight %}

Here the generalization of the <code>IteratorType</code> has been replaced by the specific <code>int</code> type. This signature should indicate to a client that this algorithm does not work with with iterators in general, but instead sends integers directly via MPI.

This change certainly limits the ability to re-use this code, since it will now work only with generative iterators which can be serialized to integers. But for those specific cases (which are the only cases I have for the feature I am developing), the performance of this algorithm is significantly better than the more general alternative.

The engineering decision is whether to use the generalization to foster re-use of non-trivial code, or to use the specific case to take advantage the details leaky by the generalization and provide better performance. For this case, I have chosen the latter.
