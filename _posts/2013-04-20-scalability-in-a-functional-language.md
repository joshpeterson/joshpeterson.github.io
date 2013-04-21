---
layout: post
title: Scalability in a Functional Language
---
I've heard a lot of buzz recently about functional programming languages. Many well-respected developers and speakers have been making the case that functional languages will allow better use of multiple processors, because functional languages prevent data sharing.

I have very little experience with functional languages, so I wanted to try this for myself. Do functional languages make implementation of algorithms for multiple processors easy? As a novice functional developer, can I implement a CPU-bound algorithm that scales linearly using a functional language with less effort than I can in an imperative language?

##TL;DR##
Functional languages are not a panacea for multi-processor development. They prevent data sharing by default, and require the developer to think about shared data when it is used. However, development of a scalable, mulit-processor algorithm is still difficult. It requires intimate knowledge of both the problem domain and the development tools.

##The Problem##
I've been aware of this problem from a young age - sharing. Imagine a large pile of Legos&copy;:

<a href="http://www.flickr.com/photos/8331761@N07/2502135281/">![A pile of Legos&copy;](/static/images/scalability-in-a-functional-language/pile-of-legos.jpg "Photo by musicmoon@rogers.com")</a>

If just one child is playing with these Legos&copy;, we don't have any problems. Maybe even two or three children could play together here, but what about eight, or ten, or twelve children? Soon, two or more children will want to use the same block. The ensuing contention will slow down the entire building process.

Implementation of an algorithm which scales to multiple processors faces the same problem. If any data (Legos&copy;) are shared among the processors, the contention will cause the program to take longer to complete. As more processors become involved, some capability of each processor will be wasted, waiting for 
shared data.

Ideally, an implementation should scale _linearly_, that is, the wall-clock time to execute it with two processors should be half the time to execute it with one processor. The time to execute it with four processors should be half the time required to exedcute it with two processors. In practice, this is difficult to achieve. Many implementations scale linearly up to a few processors, then suffer from increased contention as more processors are used.

In most imperative languages, data is shared between threads by default, often making data sharing difficult to find and eliminate. In functional languages data is not shared by default, giving the promise of writing scalable algorithms with less difficulty.

##The Challenge##
I attempted to implement a CPU-bound algorithm in both C++ (imperative language) and Clojure (functional language). My goal was to compare the scalability of both algorithms using shared-memory parallelism. I _did not_ attempt to compare wall-clock performance.

I choose to implement an algorithm to categorize all of the two-player Nash games of a given size as I described in a [previous post](/a-brief-introduction-to-nash-games/) for a few reasons:

* I know this algorithm well
* I already have a prior C++ implementation
* The algorithm involves no data sharing

##The Tools##

I have chosen to use [C++](http://isocpp.org) as the imperative language. My implementation depends on the [Boost](http://boost.org) and [Intel Threading Building Blocks](http://threadingbuildingblocks.org/) libraries. The source code is available [here](https://github.com/joshpeterson/Nash).

I have chosen [Clojure](http://clojure.org/) as the functional language. I am not using any additional libraries.  The source code is available [here](https://github.com/joshpeterson/nash-clojure).

##The Disclaimer##
I have some experience with C++ development. I have effectively no experience with Clojure development. I am rather certain that an experienced Clojure developer could provide a better implementation than I have. If you have suggestions to improve my implementation, please let me know! I would like to improve the implementation so that the results of this study can be more accurate.

##The Setup##
I profiled both implementations on a Windows 7 64-bit machine with two [Intel Xeon X5675](http://ark.intel.com/products/52577/) processors. I ran each implementation using between one and twelve threads. For each thread count, I ran the implementation five consecutive times, and averaged the wall-clock run time for each. I used games of size 6x6 for the C++ implementation. The Clojure implementation used signifigant more memory than the C++ implementation, so I was unable to complete a run with games of size 6x6 without exhausting all of the memory on the machine. Instead, I used games of size 5x5 for the Clojure implementation.

The DOS batch file used to run the implementations is available [here](https://gist.github.com/joshpeterson/5429267).

##The Results##
The C++ implementation almost achieved linear scalability, which was a surprising result. The Clojure implementation demonstrated consistently sub-linear scalability up to six threads. For more than six threads the wall-clock time for the execution was effectively unchanged.

###Scalability###
The chart below shows the scalability of the C++ implementation.

<a href="https://docs.google.com/spreadsheet/pub?key=0Aviq84mNTIzZdFlfMjdqaWNCSHBEQ3NYcFFPNTQyc2c&single=true&gid=0&output=html">![Nash C++ implementation run times chart](/static/images/scalability-in-a-functional-language/nash-cpp-run-times.png "Nash C++ implementation run times - follow the link to see the raw data.")</a>

The actual run time is only slightly worse than linear scalability. I did not expect the implementation to be this good. I suspect that most of the scalability comes from the Intel TBB library implementation. As we'll see later, the C++ implementation has very few cache misses, which probably improves the scalability of the implementation.

The chart below shows the scalability of the Clojure implementation.

<a href="https://docs.google.com/spreadsheet/pub?key=0Aviq84mNTIzZdFlfMjdqaWNCSHBEQ3NYcFFPNTQyc2c&single=true&gid=2&output=html">![Nash Clojure implementation run times chart](/static/images/scalability-in-a-functional-language/nash-clojure-run-times.png "Nash Clojure implementation run times - follow the link to see the raw data.")</a>

This implementation gets nearly linear scalability for two and three threads, then tails off and fails to improve after six threads, effectively wasting CPU resources for any more than six threads.
