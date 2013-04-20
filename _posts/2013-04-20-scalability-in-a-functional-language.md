---
layout: post
title: Scalability in a Functional Language
---
I've heard a lot of buzz recently about functional programming languages. Many well-respected developers and speakers have been making the case that functional languages will allow better use of multiple processors, because functional languages prevent data sharing.

I have very little experience with functional languages, so I wanted to try this for myself. Do functional languages make implementation of algorithms for multiple processors easy? As a novice functional developer, can I implement a CPU-bound algorithm that scales linearly using a functional language with less effort than I can in an imperative language?

##TL;DR##
Functional development is not a panacea for multi-processor development. It does pevent data sharing by default, and requires the developer to think about shared data when it is used. However, development of a scalable, mulit-processor algorithm is still difficult. It requires intimate knowledge of both the problem domain and the development tools.

##The Problem##
I've been aware of this problem from a young age - sharing. Imagine a large pile of Legos&copy;:

<a href="http://www.flickr.com/photos/8331761@N07/2502135281/"><img src="/static/images/scalability-in-a-functional-language/pile-of-legos.jpg" alt="A pile of Legos&copy;" title="Photo by musicmoon@rogers.com"/></a>

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
* The algorithm involves no data sharing, so it should be possible to implement it without data sharing 
