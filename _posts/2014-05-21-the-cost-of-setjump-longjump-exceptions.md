---
layout: post
title: The cost of set-jump long-jump exceptions
---
Last year Google [announced](https://groups.google.com/forum/#!topic/native-client-discuss/0spfg6O04FM) support for C++ exceptions in the PNaCL tool chain of their [Native Client](https://developer.chrome.com/native-client/overview) technology. Since my experimental project [Osoasso](https://github.com/joshpeterson/osoasso) uses exceptions for some error handling, this was excellent news. I decided to start working to build my project using PNaCL. However, I was intrigued by this statement in the announcement:

> As before C++ exception handling is off by default, to ensure better 
performance and smaller code size. It is possible to use set-jump 
long-jump exception handling on stable pexes with the 
--pnacl-exceptions=sjlj compiler flag. Full zero-cost exceptions are 
currently only supported for unstable pexes...

I was unfamiliar with the concept of set-jump long-jump exception handling, and I wondered why it had some cost associated with it. Here I'll attempt to explain that cost.

##What is set-jump long-jump exception handling?##
