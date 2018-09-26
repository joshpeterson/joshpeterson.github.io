---
layout: post
title: A C++ Template Project
---

How should I get started with a new C++ project? Usually when I have an idea for a
new project, this is the first question I need to answer. Many other languages have
a simple answer, like `cargo new hello_world --bin` (Rust) or `rails new blog`
(Ruby on Rails). In just a few seconds, I'm writing the actual code for the
project, without the need to worry about the minutiae of setting up a build or unit
test system or even continuous integration.

Don't get me wrong, I love the flexibility of C++, but without a common project
system, getting starting can be daunting. This time, I decided to start a new
project with a few days of setup, then use that setup as a general template
project. More than a month later, here we are! But I do have a [C++ template
project](https://github.com/joshpeterson/cpp-template) which has proven useful for
me. I hope it will be for you also.

## Roots

This C++ template project is based on the project from the excellent [Hello,
CMake!](https://arne-mertz.de/2018/05/hello-cmake/) blog post series by Arne
Mertz. Most often, I struggle early in the project with indecision about the
directory structure. Should production and test code be in separate directories?
How does test code access production code? Should the build output be in-tree or
out-of-tree? Arne's project structure answers these question with simplicity in
ways that make sense to me.

## What's in the box

The template project comes with some opinionated choices. They work for me - but
they are easy to change if something works better for you. The project builds with
[CMake](https://cmake.org/) and uses [Catch](ihttps://github.com/catchorg/Catch2)
for unit tests. It builds on Linux and macOS via Travis CI and on Windows via
Appveyor.

### Project structure

The project has the following top-level directories:

* The src directory is the location of all of the project's source code (header
  files and source files). The main.cpp file is built into the final executable,
  all other source files in this directory are built into a static library. Only
  code in this static library will be tested.
* The test directory contains the unit tests. The unit test executable links with
  the static library built from src directory.
* The thirdparty directory contains external code used by this project, namely,
  Catch and the CMake sanitizer integration.
* The tools directory contains a number of scripts used for building and other tool
  integration with the project.

### Other tool integration

The project integrates with a few other tools to aid in development.

* The clang-format utility is used to enforce common source code formatting. The
  tools/format script can be used locally to update code formatting to match the
  style in the .clang-format file. The tools/run-clang-format.py script is used on
  Travis CI to check formatting.
* The clang-tidy utility is used to run static analysis on the source code. The
  tools/tidy script can be used locally and on Travis CI to run clang-tidy.
* The clang address, thread, and undefined behavior sanitizers are run on the unit
  tests. The tools/sanitize script can be used to run them locally.

Since I primarily do hobby development on Linux ([on
Azure!](https://joshpeterson.github.io/hobby-development-on-azure)), these tooling
scripts are configured to run on Linux.

### My favorite tool

One of my favorite tools in the project is the very simple
[`watch`](https://github.com/joshpeterson/cpp-template/blob/master/tools/watch)
script. I enjoy running unit tests each time I save a source file. I've used
many-featured [Guard](https://github.com/guard/guard) project for this before. It
works great on Ruby projects where I already use Bundler, but the requirement to have
Bundler installed for a C++ project is pretty high. Enter the wonderful little
[`entr`](http://www.entrproject.org/) tool, which gives me the immediate feedback I
want without the need for Guard and Bundler.

## Try it for yourself

Most of all, I enjoy how commands like `cargo new` or `rails new` quickly get a
working project up and running, immediately ready for real code. While not as
pithy, this command will get you started with my C++ template project:

```
curl
https://raw.githubusercontent.com/joshpeterson/cpp-template/master/cpp-template-installer.py
| python - <my project name>
```

So give it a try, modify the template to meet your needs, and start building
someting fun!
