---
layout: post
title: Performance of NaCL vs. PNaCL
---
Since I am now able to build my experimental vector-based mathematics application [Osoasso](http://osoasso.appspot.com) using Portable Native Client (PNaCL) with [exceptions enabled](/the-cost-of-setjump-longjump-exceptions), I decided to test the performance of PNaCL.

## A confession
I chose to test the performance of Native Client (NaCL) and PNaCL by multiplying two $$nxn$$ matrices, with $$n=1024$$. The Osoasso code can use multiple threads, but I must confess that my current matrix multiplication implementation does not scale well. In fact, it scales only to about three threads, so these numbers are not nearly as good as they could be. Still, they do provide an interesting comparison between NaCL and PNaCL, at least in my code base.

I ran both tests on two machines, a dual core Intel T2050 1.6 GHz laptop and an Intel Xeon X5675 3.7GHz with 12 cores. On the former machine, I used two threads, on the latter machine I used three threads.

## NaCL performance
I multiplied the same two matrices made up of randomly generated double values five times using [version 19](http://19.osoasso.appspot.com) of Osoasso. This version is built with the NaCL newlib tool chain, and it requires the Native Client flag be enabled in Chrome. Here are the results:

<center>
<table class="gridtable">
    <tr>
        <th>Machine</th>
        <th>Intel T2050 1.6 GHz</th>
        <th>Intel Xeon X5675 3.7GHz</th>
    </tr>
    <tr>
        <td>Run 1</td>
        <td>40.6093</td>
        <td>8.76589</td>
    </tr>
    <tr>
        <td>Run 2</td>
        <td>40.636</td>
        <td>8.9953</td>
    </tr>
    <tr>
        <td>Run 3</td>
        <td>41.5904</td>
        <td>9.111</td>
    </tr>
    <tr>
        <td>Run 4</td>
        <td>40.756</td>
        <td>9.11112</td>
    </tr>
    <tr>
        <td>Run 5</td>
        <td>40.81</td>
        <td>8.84316</td>
    </tr>
    <tr>
        <td>Average</td>
        <td>40.88034</td>
        <td>8.965294</td>
    </tr>
    <tr>
        <td>MFLOPS</td>
        <td>52.531</td>
        <td>239.533</td>
    </tr>
</table>
All times are reported in seconds
</center>

<br/>

## PNaCL performance
Again, I multiplied the same two matrices made up of randomly generated double values five times using [version 20](http://20.osoasso.appspot.com) of Osoasso. This version is built with the PNaCL tool chain, and it does not require the Native Client flag be enabled in Chrome. Here are the results:

<center>
<table class="gridtable">
    <tr>
        <th>Machine</th>
        <th>Intel T2050 1.6 GHz</th>
        <th>Intel Xeon X5675 3.7GHz</th>
    </tr>
    <tr>
        <td>Run 1</td>
        <td>47.2024</td>
        <td>7.48539</td>
    </tr>
    <tr>
        <td>Run 2</td>
        <td>47.8889</td>
        <td>8.73858</td>
    </tr>
    <tr>
        <td>Run 3</td>
        <td>49.0555</td>
        <td>8.94701</td>
    </tr>
    <tr>
        <td>Run 4</td>
        <td>47.7729</td>
        <td>8.91277</td>
    </tr>
    <tr>
        <td>Run 5</td>
        <td>48.9688</td>
        <td>9.01714</td>
    </tr>
    <tr>
        <td>Average</td>
        <td>48.1777</td>
        <td>8.620178</td>
    </tr>
    <tr>
        <td>MFLOPS</td>
        <td>44.574</td>
        <td>249.123</td>
    </tr>
</table>
All times are reported in seconds
</center>

<br/>

## Comparison
These results present a mixed bag. While the performance of PNaCL was consistently worse on an older, dual-core laptop, it performed slightly better on a Xeon processor. For my experimental application at least, the cost of using PNaCL seems to be worth the benefit of portability. Now that the PNaCL build is the default for Osoasso, it can run in Chrome without the need to enable special flags.

