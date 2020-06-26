---
layout: post
title: Docker for C++ builds
---
A few years ago, one of my colleagues at Unity was discussing some work to get our
tests running on a new local CI system. She described a recent discussion with
developer services team as "Docker, Docker, Kubernetes" (hearkening back to the
famous Seinfeld [Yada, Yada](https://en.wikipedia.org/wiki/The_Yada_Yada) episode).
As a developer with no experience in "cloud" things, this is often how I feel.
These "containers" seem to be so useful, yet magical and out of reach for me. So I
decided to go off on a quest and slay the "Docker, Docker, Kubernetes" dragon
(well, at least Docker, I still don't know what Kubernetes is).

## Using Docker on CI for C++ Linux builds

One of my biggest difficulties with hobby C++ project is dealing with CI systems.
[Travis CI](https://travis-ci.com) has a great free service for open source projects, but
often I would complete a new feature locally, only to see it fail on CI. There must
be a better way to reproduce the CI build configuration locally!

In addition, keeping up with the latest C++ compiler versions on CI is difficult.
The feedback loop required to change a .yml file, push a change, then wait for a
build to run on CI is simply too long. Local iteration would be much more
efficient.

### The final product

If you're not interested in the details, just check out the Travis CI
[configuration](https://github.com/joshpeterson/cpp-template/blob/master/.travis.yml)
in my cpp-template repository. I'm pretty happy with the end result. Each CI step
on Linux is a single `docker` invocation that I can easily run locally.

### Creating a Docker container

A container is a lightweight Linux installation where you explicitly define
_everything_ that is installed.

* Lightweight: it is much smaller in size than a full Linux installation; it "boots
  up" very fast.
* Linux: It is running a real Linux OS, and must run "on top of" a full Linux
  installation.
* You define what is installed: You must indicate all of the packages (e.g. in the
  apt-get sense) that are installed - you don't have access to anything else.

I'm sure this is not a good technical description of containers, but for someone
with no experience in this world, I find it helpful to view them like this.

[Docker](https://docker.com) is a tool for creating and running containers (there are
probably other such tools out there). It accepts a Dockerfile as input. A
Dockerfile is a text document written in a domain-specific language that Docker
understands. This file is used to tell Docker about that third point above - what
packages should be installed on your Linux container.

These Docker inputs can get pretty complex, but you can also accomplish a lot with
a simple one. My Dockerfile for builds with GCC is below:

```
FROM gcc:10.1.0
RUN apt-get update
RUN apt-get install -y cmake ninja-build time
```

Let's break this down:

```
FROM gcc:10.1.0
```

The first line is the most interesting. The `FROM` statement means "Create this
container by starting from another container first." The starting container in this
case is named "gcc" (more on that later). The part after the colon is the "tag",
which could be anything, but is most often a version number.

But where does this "gcc" container come from? Docker has a service called
[Dockerhub](https://hub.docker.com/) where anyone can publish Docker containers.
The name "gcc" means "Look for a container named gcc on Dockerhub. If you find one,
download it, and use it as the starting point for my container."

The GCC developers publish a container on Dockerhub for each GCC release. This
container is based in turn on a Debian Linux container. So now my container can
have everything set up and ready to go to use GCC version 10.1.0 with just one line
in my Dockerfile, neat!

```
RUN apt-get update
RUN apt-get install -y cmake ninja-build time
```

These last to lines use the `RUN` statement, which tells Docker to execute the text
following is as a shell command. The two specific commands I'm using tell the
Debian package manager (`apt`) to first update to repositories to look for the
latest packages, then install three packages that I need to build the C++ code in
my projects: CMake, Ninja, and the `time` command (see, you really need to
install, _everything_ you need).

### Solving my problems

Wow, so this is really cool - I'm doing cloud stuff! ☁️  But seriously, this solves
my two problems with CI:

* Updating the version of a C++ compiler is now as simple as changing one version
  number in my Dockerfile.
* I can test my CI set up locally by running one Docker command, so iteration on CI
  changes is now much faster.

🎉

### My docker images

I've created Docker images for [GCC](https://hub.docker.com/r/petersonjm1/gcc),
[Clang](https://hub.docker.com/r/petersonjm1/clang), and
[Emscripten](https://hub.docker.com/r/petersonjm1/emscripten) on Linux (I'm working
on a Windows image, but that is not complete yet). You can check them out on
Dockerhub and maybe use them as a base for your image. Happy cloud fun! 🌩️
