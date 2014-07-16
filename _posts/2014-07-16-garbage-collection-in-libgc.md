---
layout: post
title: Garbage collection in libgc
---
In my [previous post](/reading-the-libgc-code) I attempted to read and understand some of the allocation code in the [libgc](https://github.com/ivmai/bdwgc/) garbage collector. In this post I will attempt to understand some of the collection code.

The libgc code is a _conservative_ garbage collector. That is, it does not require the allocator, client program, or operating system do anything special to allow it to recognize pointers to objects allocated on the heap. Instead, it scans the memory and registers, looking for values that might be pointers, and attempts to reclaim unused memory. Interestingly, the libgc code provides [no guarantees](https://github.com/ivmai/bdwgc/#general-description) that it will reclaim all unused memory! However, it is usually able to reclaim most, leaving the amount of memory not reclaimed bounded.

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

We saw in the previous post that libgc makes a distinction between large and small objects. I need to allocate an object of size 2048 bytes to use the large object allocation on my 32-bit Windows 7 machine. Garbage collection is first attempted when the libgc code recognizes that it does not have enough free space to complete the requested allocation. The `GC_alloc_large` function calls `GC_allochblk` once to perform the necessary allocation. If this allocation fails, the `GC_collect_or_expand` function is called to attempt to either reclaim some unused memory or expand the pool of available memory from the OS. Once `GC_collect_or_expand` completes, `GC_allochblk` is called again.

##Marking objects that are in use##
The libgc code uses a marking process to determine which blocks of allocated memory are still in use, and therefore which ones can be reclaimed. A block that is probably still in use is marked and will not be reclaimed yet. The code which does the marking is in the `GC_mark_from` function in the `mark.c` file.

Reading this function is a bit daunting, since it is rather complex. This is a quote from the comment at the top of the function:

> Note that this is the most performance critical routine in the collector.  Hence it contains all sorts of ugly hacks to speed things up. 

I won't attempt to understand the entire function. Instead, I'll stick to the section near the [end](https://github.com/ivmai/bdwgc/blob/master/mark.c#L830-L851) of the function which actually marks used blocks.

{% highlight C++ linenos %}
while ((word)current_p <= (word)limit) {
  /* Empirically, unrolling this loop doesn't help a lot. */
  /* Since PUSH_CONTENTS expands to a lot of code,        */
  /* we don't.                                            */
  current = *(word *)current_p;
  FIXUP_POINTER(current);
  PREFETCH(current_p + PREF_DIST*CACHE_LINE_SIZE);
  if (current >= (word)least_ha && current < (word)greatest_ha) {
    /* Prefetch the contents of the object we just pushed.  It's  */
    /* likely we will need them soon.                             */
    PREFETCH((ptr_t)current);
# ifdef ENABLE_TRACE
    if (GC_trace_addr == current_p) {
      GC_log_printf("GC #%u: considering(1) %p -> %p\n",
                    (unsigned)GC_gc_no, current_p, (ptr_t)current);
    }
# endif /* ENABLE_TRACE */
    PUSH_CONTENTS((ptr_t)current, mark_stack_top,
                  mark_stack_limit, current_p, exit2);
  }
  current_p += ALIGNMENT;
}
{% endhighlight %}

Sometimes I find it easier to read code from the inside out. That is, find the code which performs the action I want to understand, then follow the conditional statements which lead to that code, starting with the closest.

In this case, I want to learn how objects that are in use are marked. The libgc code keeps track of a stack of marked objects. This code will add a block to the stop of the stack in the `PUSH_CONTENTS` macro on line 18. An object is considered in use (line 8), and is marked, if its address (represented by `current`) is between the least (`least_ha`) and greatest (`greatest_ha`) plausible heap addresses, which were computed earlier. The searching starts at `current_p` (line 1) and stops with the bound determined by `limit`.

As the comment at the top of the function mentions, the calling code is responsible to call `GC_mark_from` for each frame on the mark stack.

##Reclaiming everything not marked##
After all of the allocated memory that is in use has been marked, the `GC_reclaim_block` function is called to free all blocks that are not marked via the `GC_freehblk` function. Once a block is reclaimed, it is added to the free list so that it can be used again in a subsequent allocation.

##Conclusion##
I've learned a bit about the allocation and collection code in libgc. The code is rather complex and highly optimized for various compilers and platforms, so understanding even a small portion of it is difficult. The fact that it can serve as a drop-in replacement for `malloc` and `free` without placing any additional requirements on the client code or the operating system is fascinating.
