---
layout: post
title: Garbage collection in libgc
---
In my [previous post](/reading-the-libgc-code) I attempted to read and understand some of the allocation code in the [libgc](https://github.com/ivmai/bdwgc/) garbage collector. I will continue in this post, attempting to understand the collection code.

The libgc code is a _conservative_ garbage collector. That is, it places no requirements on the allocation, client program, or operating system specifying how it can recognize pointers to objects allocated on the heap. Instead, it scans the memory and registers of a process, looking for values that might be pointers, and attempts to reclaim unused memory. Interestingly, the libgc code provides [no guarantees](https://github.com/ivmai/bdwgc/#general-description) that it will reclaim all unused memory! However, it is usually able to reclaim most, leaving the amount of unreclaimed memory bounded.

##Disclaimer##
The libgc code is the Boehm-Demers-Weiser conservative garbage collector for C and C++. It is used in a number of projects, including Mono and GCJ. I'm entirely new to the code base, so any conclusions I draw here could be incorrect. Please take them with a grain of salt, or, better yet, attempt to disprove them yourself. If you do, please let me know, as I am happy to learn something that I may have missed.

##When does garbage collection occur##
Garbage collection actually occurs during allocation. To see this, I'll use the following test program:

{% highlight C++ %}
#define GC_NOT_DLL
#include <gc.h>

void allocate_something() {
  void* pointers[1000];
  for (auto i = 0; i < 1000; ++i)
    pointers[i] = GC_malloc(2048);
}

int main() {
  allocate_something();
  allocate_something();
}
{% endhighlight %}

We saw in the previous post that libgc makes a distinction between large and small objects. I need to allocated 2048 bytes on my machine to use the large object allocation. Garbage collection is first attempted when the libgc code recognizes that it does not have enough free space to complete the requested allocation. The `GC_alloc_large` function calls `GC_allochblk` once to perform the necessary allocation. If this allocation fails, the `GC_collect_or_expand` function is called to attempt to either reclaim some unused memory or expand the pool of available memory from the OS. Once `GC_collect_or_expand` completes, `GC_allochblk` is called again.
