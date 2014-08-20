---
layout: post
title: Getting started with pepper.js on Windows
---
For some time now I've wanted to make my vector-based math application [Osoasso](https://github.com/joshpeterson/osoasso) work with [Emscripten](https://github.com/kripken/emscripten/wiki) and [pepper.js](https://github.com/google/pepper.js). Since Osoasso uses Google's [Native Client SDK](https://developer.chrome.com/native-client) to allow C++ code to execute in a browser, it is restricted to working in Google Chrome only. The pepper.js project gives the promise that the same code may work in most browsers. I'm especially interested in the performance tradeoff between C++ and JavaScript code in this case.

This week I decided to give pepper.js a try. I've not yet started to compile my code, but I ran into a few problems compiling and running the examples. I wanted to write down the solutions here so that others and I won't need to solve the same problems again.

##Getting dependencies##

###Emscripten###
To use pepper.js, I first needed to install Emscripten. I was able to obtain the Emscripten SDK from [this page](http://kripken.github.io/emscripten-site/docs/getting_started/downloads.html). At the time of writing, version 1.22.0 is the latest version of the SDK. However, I'm using 32-bit Windows 7, so I had to scroll to bottom of the page and download version 1.12.0, the last version for 32-bit Windows.

###Windows make###
The pepper.js [README](https://github.com/google/pepper.js/blob/master/README.rst) indicates the next step is to build the examples using the following command (among a few others):

```
make TOOLCHAIN=emscripten CONFIG=Debug
```

When I initially tried this, I saw a rather odd, and surprising error. As it turns out, I had the D SDK installed, so the `make` command on my machine was running the D version of `make`, not the GNU version. After moving the D verison out of the way, I downloaded the GNU Win32 version of make [here](http://gnuwin32.sourceforge.net/packages/make.htm).

##Spaces in a path##
