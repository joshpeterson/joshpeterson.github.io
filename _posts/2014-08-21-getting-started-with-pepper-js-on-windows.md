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
When I ran the command above, I noticed the following output:

```
make -C ppapi
make[1]: Entering directory `C:/Users/Josh/Documents/development/pepper.js/examples/ppapi'
  CXX emscripten/debug/stub_emscripten.o
'C:\Program' is not recognized as an internal or external command, operable program or batch file.
make[1]: *** [emscripten/debug/stub_emscripten.o] Error 1
make[1]: Leaving directory `C:/Users/Josh/Documents/development/pepper.js/examples/ppapi'
make: *** [ppapi_TARGET] Error 2
```

This indicates that some part of the build system is not handling the space between the words Program and Files in the path to some executable. But which executable is the problem? I'm by no means an expert in Makefile debugging, but I did find that `make` has a `-d` option, which I used. After a good bit of output, I saw this information

```
Creating temporary batch file C:\Users\Josh\AppData\Local\Temp\make3560-1.bat
make[1]: Entering directory `C:/Users/Josh/Documents/development/pepper.js/examples/ppapi'
CreateProcess(C:\Users\Josh\AppData\Local\Temp\make3560-1.bat,C:\Users\Josh\AppData\Local\Temp\make3560-1.bat,...)
Putting child 0x012ada98 (emscripten/debug/stub_emscripten.o) PID 19563464 on the chain.
Live child 0x012ada98 (emscripten/debug/stub_emscripten.o) PID 19563464
  CXX emscripten/debug/stub_emscripten.o
'C:\Program' is not recognized as an internal or external command, operable program or batch file.
Reaping losing child 0x012ada98 PID 19563464
Cleaning up temp batch file C:\Users\Josh\AppData\Local\Temp\make3560-1.bat
```

So it seemed likely that the file make3560-1.bat was being executed and was causing the problem. Unfortunately, that file was deleted after the error.

Next, I used the `-i` option to cause `make` to continue after an error occurs. I was able to find a build which ran long enough so that I could view the contents of the make<PID>-1.bat file. Sure enough, the path to the Emscripten compiler was not quoted. Since Emscripten installed into the `C:\Program Files\Emscripten\emscripten\1.12.0` directory on my computer and set the `EMSCRIPTEN` environment variable to point to that directory, this problem occurred. I [modified](https://github.com/google/pepper.js/commit/15a802244ff71a6a792b8311866e86c1569358d2#diff-d41d8cd98f00b204e9800998ecf8427e) the tools/nacl_emscripten.mk file to quote the paths to the Emscripten compilers, and the make command succeeded. This change has now been pulled into the pepper.js source, so it should be corrected.

##Building in release##
