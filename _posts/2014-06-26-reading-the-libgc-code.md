---
layout: post
title: Reading the libgc code
---
##Building libgc on Windows##
Following the instructions in the [README.win32](https://github.com/ivmai/bdwgc/blob/master/doc/README.win32) file to build libgc using Visual Studio 2013, I ran into a few problems. I renamed the [NT_MAKEFILE](https://github.com/ivmai/bdwgc/blob/master/NT_MAKEFILE) file to be MAKEFILE, then changed to the bdwgc directory in a Visual Studio command prompt window. When I ran the `nmake` command, I saw the following output:

```
Microsoft (R) Program Maintenance Utility Version 12.00.21005.1
Copyright (C) Microsoft Corporation.  All rights reserved.

makefile(6) : fatal error U1052: file 'ntwin32.mak' not found
Stop.
```

It turns out that Visual Studio cannot fine the ntwin32.mak file in its installation directories. After a bit of searching, I found this file in the C:\Program Files\Microsoft SDKs\Windows\v7.1A\Include directory on my machine. So I copied both ntwin32.mak and win32.mak from that directory into the C:\Program Files\Microsoft Visual Studio 12.0\VC\include directory. This allowed the nmake command to complete successfully.
