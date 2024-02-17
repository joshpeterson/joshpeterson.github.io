---
layout: post
title: More fun with loop unrolling - C++
---
After exploring [loop unrolling in Mojo](/learning-loop-unrolling), I wanted to take a similar path with C++. Can we get similar assembly code from a C++ compiler, given similar input code? Let's dive in and find out!

## The setup

I've written a simple `Matrix` class in C++, templated on the row and column size (so those are available at compile time). You can find all of the code for it on [Github](https://github.com/joshpeterson/on-a-roll/tree/main/cpp). Here is the naive `matMul` implementation.

```c++
template <int M, int N>
Matrix<M, N> matMul(const Matrix<M, N>& left, const Matrix<N, M>& right) {
  Matrix<M, N> result;
  for (int i = 0; i < left.numberOfRows(); i++) {
    for (int j = 0; j < right.numberOfColumns(); j++) {
      result(i, j) = 0;
      for (int k = 0; k < left.numberOfColumns(); k++) {
        result(i, j) += left(i, k) * right(k, j);
      }
    }
  }
  return result;
}
```

I'm testing this using Apple clang version 15 on a macOS M2 processor. As in the previous post, I'll use Ghidra for local assembly code analysis and Hyperfine for profiling. You can fiddle with the code and compiler options from this post on [Compiler Explorer](https://godbolt.org/z/oTqWWe39z).

The naive implementation, with no loop unrolling directives causes clang to produce assembly code for the inner loop similar to what we saw from Mojo.

```asm
.LBB0_5:
ldr s1, [x9, x14]
add x14, x14, #4
ldr s2, [x16]
add x16, x16, #1, lsl #12
cmp x14, #1, lsl #12
fmadd s0, s1, s2, s0
str s0, [x0, x15, lsl #2]
b.ne .LBB0_5
```

The heart of this code is the [`fmadd`](https://developer.arm.com/documentation/ddi0602/2023-12/SIMD-FP-Instructions/FMADD--Floating-point-fused-Multiply-Add--scalar--?lang=en) instruction, operating on one 32-bit floating point value at a time. Here is the baseline profiling result for this case:

```
Benchmark 1: ./build/matmul                                                        
  Time (mean ± σ):      1.267 s ±  0.003 s    [User: 1.243 s, System: 0.003
  Range (min … max):    1.263 s …  1.274 s    10
```

## Let's unroll this

With the Mojo case, we found that unrolling the loop gave the compiler the ability to vectorize the loop, and take advantage of the [`fmla`](https://developer.arm.com/documentation/ddi0602/2022-06/SVE-Instructions/FMLA--vectors---Floating-point-fused-multiply-add-vectors--predicated---writing-addend--Zda---Zda---Zn---Zm--) instruction, to give us almost 4 times better performance. We can state our intentions to force loop unrolling to the compiler with the `#pragma unroll(n)` directive:

```c++
#pragma unroll(4)
for (int k = 0; k < left.numberOfColumns(); k++) {
        result(i, j) += left(i, k) * right(k, j);
```

Interestingly, clang gives us four scalar `fmadd` instructions:

```asm
.LBB0_5:
add x17, x10, x14
ldr s1, [x16]
add x14, x14, #16
cmp x14, #1, lsl #12
ldp s2, s3, [x17, #-12]
fmadd s0, s2, s1, s0
ldr s1, [x16, #4096]
ldr s2, [x16, #8192]
fmadd s0, s3, s1, s0
ldur s1, [x17, #-4]
fmadd s0, s1, s2, s0
ldr s1, [x17]
ldr s2, [x16, #12288]
add x16, x16, #4, lsl #12
fmadd s0, s1, s2, s0
str s0, [x0, x15, lsl #2]
b.ne .LBB0_5
```

The performance is slightly better, but nothing like the 3-4x improvement which is possible:

```
Benchmark 1: ./build/matmul
  Time (mean ± σ):      1.181 s ±  0.009 s    [User: 1.161 s, System: 0.003 s]
  Range (min … max):    1.163 s …  1.195 s    10 runs
```

Why isn't clang able to vectorize this loop? As it turns out, there is a [command line option](https://llvm.org/docs/Vectorizers.html#diagnostics) we can pass to clang to have it tell us that answer: `-Rpass-analysis=loop-vectorize`!

```
remark: loop not vectorized: cannot prove it is safe to reorder floating-point operations; allow reordering by specifying '#pragma clang loop vectorize(enable)' before the loop or by providing the compiler option '-ffast-math'. [-Rpass-analysis=loop-vectorize]

        result(i, j) += left(i, k) * right(k, j);
```

Ahh, the compiler is providing some strict floating point ordering guarantees, and so does not vectorize this loop. If we use the `#pragma clang loop vectorize(enable)`, let's see what happens to the generated assembly code.

```asm
.LBB0_9:
ldr s4, [x5, x13]
add x6, x5, #1, lsl #12
ldr s3, [x5]
add x7, x5, #5, lsl #12
add x19, x12, x4
add x4, x4, #32
cmp x4, #1, lsl #12
ld1 { v3.s }[1], [x6]
add x6, x5, #2, lsl #12
ld1 { v4.s }[1], [x7]
add x7, x5, #6, lsl #12
ldp q5, q6, [x19, #-16]
ld1 { v3.s }[2], [x6]
add x6, x5, #3, lsl #12
ld1 { v4.s }[2], [x7]
add x7, x5, #7, lsl #12
add x5, x5, #8, lsl #12
ld1 { v3.s }[3], [x6]
ld1 { v4.s }[3], [x7]
fmla v2.4s, v3.4s, v5.4s
fmla v1.4s, v4.4s, v6.4s
b.ne .LBB0_9
```

We now have two `fmla` instructions, but the loop has a lot of other register shifting operations that will likely hurt performance. Here is what Hyperfine has to show us:

```
Benchmark 1: ./build/matmul
  Time (mean ± σ):      1.002 s ±  0.020 s    [User: 0.978 s, System: 0.003 s]
  Range (min … max):    0.979 s …  1.041 s    10 runs
```

## Let's try another compiler

One of the great things about the C++ ecosystem is the presence of multiple compiler implementations. Notice in the Compiler Explorer link, I've added GCC 13.2. Check out the assembly code it produces for even the naive `matMul`, with no unrolling or vectorization directives.

```asm
.L25:
lsl x8, x3, 12
ldr s2, [x1, x3, lsl 2]
add x3, x3, 1
ldr q1, [x7, x8]
fmla v0.4s, v1.4s, v2.s[0]
cmp x3, 1024
bne .L25
```

It is vectorizing by default! This looks very similar to the unrolled output we saw from Mojo. Let's check the performance of this code.

```
Benchmark 1: ./build/matmul
  Time (mean ± σ):     340.7 ms ±   2.1 ms    [User: 318.0 ms, System: 3.8 ms]
  Range (min … max):   337.7 ms … 344.5 ms    10 runs
```

This looks better! We're at nearly 4 times the performance of the naive implementation compiled with clang. Since GCC is able to "see through" our algorithm, it can vectorize the code and take advantage of the SIMD instructions available on the processor.

## C++ vs. Mojo

Note that this is not a direct comparison of C++ and Mojo performance. The performance I am measuring involves more than just `matMul` (although that algorithm does dominate the execution time). Things like memory management and random floating point generation also differ.

It is a comparison of the assembly code that different languages and compilers emit. I find it fascinating to see such similar code generated by two different language implementations.