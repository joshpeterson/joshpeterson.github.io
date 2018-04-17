---
layout: post
title: Introducing Struct Layout
---

I've built a fun little tool to help understand the way a C or C++ compiler will
layout members in a struct or class. Behold, [Struct
Layout](https://structlayout.herokuapp.com). This tool uses the
[Layout](https://github.com/joshpeterson/layout) utility behind the scenes. Layout
parses C and C++ code using libclang. It generates C code with proper `sizeof` and
`offsetof` operators to output a table including the size of each type, the size,
offset, and padding for each field.

This information can be useful, as it may be surprising how a compiler lays out a
given type in memory. The compiler may need to deal with platform-specific
alignment requirements for certain types. If you are writing cross-platform code,
it can be useful to understand how compilers behave on all of your target
platforms.

If you are thinking about data-oriented design, data layout can be rather
important. Knowing the number of object which fit into a cache line can inform your
decisions about how algorithms can best make use of processor and memory resources.

I've already found this tool useful for day-to-day work, I hope that you do as
well!
