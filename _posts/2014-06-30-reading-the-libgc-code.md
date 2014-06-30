---
layout: post
title: Reading the libgc code
---
After listening to a recent [episode](http://rubyrogues.com/159-rr-hacking-education-with-saron-yitbarek/) of Ruby Rogues, I was inspired to read some code. I've also been trying to learn something about the [libgc](https://github.com/ivmai/bdwgc/) code, so I thought this might be a good opportunity to read some code and write about it.

##Disclaimer##
The libgc code is the Boehm-Demers-Weiser conservative garbage collector for C and C++. It is used in a number of projects, including Mono and GCJ. I'm entirely new to the code base, so any conclusions I draw here could be incorrect. Please take them with a grain of salt, or, better yet, attempt to disprove them yourself. If you do, please let me know, as I am happy to learn something that I may have missed.

##Building libgc on Windows##
Code is executable, so one of the benefits of reading code is the clarity about the authors intention you can gain by debugging the code.

Following the instructions in the [README.win32](https://github.com/ivmai/bdwgc/blob/master/doc/README.win32) file to build libgc using Visual Studio 2013, I ran into a few problems. I renamed the [NT_MAKEFILE](https://github.com/ivmai/bdwgc/blob/master/NT_MAKEFILE) file to be MAKEFILE, then changed to the bdwgc directory in a Visual Studio command prompt window. When I ran the `nmake` command, I saw the following output:

<pre>
Microsoft (R) Program Maintenance Utility Version 12.00.21005.1
Copyright (C) Microsoft Corporation.  All rights reserved.

makefile(6) : fatal error U1052: file 'ntwin32.mak' not found
Stop.
</pre>

It turns out that Visual Studio cannot fine the ntwin32.mak file in its installation directories. After a bit of searching, I found this file in the C:\Program Files\Microsoft SDKs\Windows\v7.1A\Include directory on my machine. So I copied both ntwin32.mak and win32.mak from that directory into the C:\Program Files\Microsoft Visual Studio 12.0\VC\include directory. This allowed the nmake command to complete successfully.

##Understanding allocation##
The libgc code is designed to be a drop-in replacement for heap-based memory management in C and C++ programs, so it provides an implementation of `malloc`, named `GC_malloc` (the functions in the public interface of libgc all start with the GC_ prefix). To start my investigation of the code, I built the following program on 32-bit Windows 7:

{% highlight C++%}
#define GC_NOT_DLL
#include <gc.h>

int main() {
  int* small = (int*)GC_malloc(sizeof(int));
  *small = 42;

  int* small2 = (int*)GC_malloc(sizeof(int));
  *small2 = 1;

  void* large = GC_malloc(2048);
}
{% endhighlight %}

This code compiles using the `bdwgc\include` directory in the include path, and linking against the gc.lib static library. The `GC_NOT_DLL` define indicates that the code is using the static library.

The code I will read is contained in the [malloc.c](https://github.com/ivmai/bdwgc/blob/master/malloc.c) file from lines 253 to 286:

{% highlight C++ linenos %}
/* Allocate lb bytes of composite (pointerful) data */
#ifdef THREAD_LOCAL_ALLOC
  GC_INNER void * GC_core_malloc(size_t lb)
#else
  GC_API GC_ATTR_MALLOC void * GC_CALL GC_malloc(size_t lb)
#endif
{
  void *op;
  size_t lg;
  DCL_LOCK_STATE;

  if(SMALL_OBJ(lb)) {
    GC_DBG_COLLECT_AT_MALLOC(lb);
    lg = GC_size_map[lb];
    LOCK();
    op = GC_objfreelist[lg];
    if (EXPECT(0 == op, FALSE)) {
      UNLOCK();
      return (GENERAL_MALLOC((word)lb, NORMAL));
    }
    GC_ASSERT(0 == obj_link(op)
      || ((word)obj_link(op)
          <= (word)GC_greatest_plausible_heap_addr
        && (word)obj_link(op)
          >= (word)GC_least_plausible_heap_addr));
    GC_objfreelist[lg] = obj_link(op);
    obj_link(op) = 0;
    GC_bytes_allocd += GRANULES_TO_BYTES(lg);
    UNLOCK();
    return op;
  } else {
    return(GENERAL_MALLOC(lb, NORMAL));
  }
}
{% endhighlight %}

The libgc code separates allocations into small and large objects. On my machine, any allocations of 2047 bytes or less are considered small objects by default, and libgc attempts to allocate these objects closer together. The test code I'm using allocates two small objects of the same size (4 bytes) so that we can see the process of allocation with and without initialization. Then the code allocates the smallest large object possible (2048 bytes), so that we can see the large object allocation process.

Here are a few tips for reading this code:

* The libgc code defines a _granule_ as its smallest possible allocation size. On my machine, a granule is 8 bytes.
* Some of the global data structures here are defines that forward the global `GC_arrays` structure. In the debugger, Visual Studio is not able to follow the defines, so it is helpful for me to watch the actual values.
  * `GC_size_map` (line 14) is `GC_arrays._size_map`, the number of granules to allocate for a given size
  * `GC_objfreelist` (line 16) is `GC_arrays._objfreelist`, the free list of objects
  * `GC_bytes_allocd` (line 28) is `GC_arrays._bytes_allocd`, the total number of bytes allocated

##Small object allocation##
Most of the code here is used for small object allocation. The `op` local variable, of type `void *` will be used to hold the point to the memory allocated for a small object. The `lg` local variable is the number of granules necessary to hold the small object. The code on lines 14 and 16 is used to determine first the number fo granules for the given size. In my case, 4 bytes requires 1 granule, so `lg` has a value of 1. Then the free list for granules of size 1 is checked. During the first allocation of a small object, `op` will have a value of `NULL`, so `GENERAL_MALLOC` will be called on line 19 to initialize the free list for objects that require 1 granule and allocate the memory for this object. After this is complete, the `GC_bytes_allocd` global will have a value of 8, since one granule has been used.

A second small object allocation completes much faster, skipping the initialization in `GENERAL_MALLOC`, and pulling an object directly off the free list on line 16. This behavior indicates the reason for the distinction between small and large objects. Multiple allocations of small objects, especially when they are similar in size, can be preformed with very low overhead.

##Large object allocation##
Large object allocation occurs entirely in the `GENERAL_MALLOC` function, which forwards to the `GC_generic_malloc` function on lines 170 to 222 of malloc.c. I'll include the snippet of this function that deals with large object allocation, from lines 184 to 215:

{% highlight C++ linenos %}
size_t lg;
size_t lb_rounded;
word n_blocks;
GC_bool init;

lg = ROUNDED_UP_GRANULES(lb);
lb_rounded = GRANULES_TO_BYTES(lg);
if (lb_rounded < lb)
    return((*GC_get_oom_fn())(lb));
n_blocks = OBJ_SZ_TO_BLOCKS(lb_rounded);
init = GC_obj_kinds[k].ok_init;
LOCK();
result = (ptr_t)GC_alloc_large(lb_rounded, k, 0);
if (0 != result) {
  if (GC_debugging_started) {
    BZERO(result, n_blocks * HBLKSIZE);
  } else {
#ifdef THREADS
  /* Clear any memory that might be used for GC descriptors */
  /* before we release the lock.                            */
    ((word *)result)[0] = 0;
    ((word *)result)[1] = 0;
    ((word *)result)[GRANULES_TO_WORDS(lg)-1] = 0;
    ((word *)result)[GRANULES_TO_WORDS(lg)-2] = 0;
#endif
  }
}
GC_bytes_allocd += lb_rounded;
UNLOCK();
if (init && !GC_debugging_started && 0 != result) {
    BZERO(result, n_blocks * HBLKSIZE);
}
{% endhighlight %}

Once this code is executed, libgc has already determined this is a large object allocation. This large object will get its own section, defined by the number of granules on line 6. In this case, 2048 bytes require 257 granules, meaning the code will actually allocate 2056 bytes (the value of `lb_rounded` on line 7). This corresponds to 1 block on line 10, and the allocation occurs on line 13. If the allocation succeeds, the total number of bytes allocated is increased to 2072 on line 28, and the allocated memory is cleared on line 31 via a call to `memset`.

##Just the beginning##
The libgc code is complex and highly optimized, so this reading of the code has just scratched the surface of the allocation process. Next, I'll explore how the code performs garbage collection.
