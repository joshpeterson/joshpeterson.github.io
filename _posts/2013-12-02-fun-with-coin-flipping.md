---
layout: post
title: Fun with coin flipping
---
In the November 2013 issue of Communications of the ACM Peter Winkler proposed three interesting [puzzles](http://cacm.acm.org/magazines/2013/11/169037-puzzled-coin-flipping/abstract) about coin flipping. The puzzles initially seem rather simple, but I suspect that my intuition about the answers is incorrect. To test my intuition, I've written a [utility](https://github.com/joshpeterson/CoinFlipping/blob/master/cfa.py) in Python to perform some Monte Carlo simulations for each problem. If I've written the utility correctly, these simulations should provide the correct answers. I'm looking forward to the arrival of the December issue.

##Problem 1##

The first problem is:

> You have just joined the Coin Flippers of America, and, naturally, the amount of your annual dues will be determined by chance. First you must select a head-tail sequence of length five. A coin is then flipped (by a certified CFA official) until that sequence is achieved with five consecutive flips. Your dues is the total number of flips, in U.S. dollars; for example, if you choose HHHHH as your sequence, and it happens to take 36 flips before you get a run of five heads, your annual CFA dues will be $36. What sequence should you pick? HHHHH? HTHTH? HHHTT? Does it even matter?

My intuition for this problem is that each flip of the coin has an equal chance (one out of two) of being a head or a tail. So the probability of five flips occurring in the head-tail sequence I have chosen is

$$1/2 * 1/2 * 1/2 * 1/2 * 1/2 = 1/2^5 = 1/32$$

This indicates that I should expect to pay about $32 for my dues, regardless of which sequence I choose. However, my utility shows that the story is a bit more complicated. I ran the Monte Carlo simulation using 100, 1,000, 10,000, and 100,000 iterations.  The results are shown in this chart (the full data are available [here](https://docs.google.com/spreadsheet/pub?key=0Aviq84mNTIzZdHBfblhIYmdwenBLY3JUWmdfXzNVMmc&single=true&gid=0&output=html)):

<script type="text/javascript" src="//ajax.googleapis.com/ajax/static/modules/gviz/1.0/chart.js"> {"dataSourceUrl":"//docs.google.com/spreadsheet/tq?key=0Aviq84mNTIzZdHBfblhIYmdwenBLY3JUWmdfXzNVMmc&transpose=1&headers=1&range=A1%3AE33&gid=0&pub=1","options":{"titleTextStyle":{"bold":true,"color":"#000","fontSize":16},"series":{"0":{"errorBars":{"errorType":"none"},"targetAxisIndex":0}},"animation":{"duration":500},"width":640,"hAxis":{"useFormatFromData":true,"title":"Number of iterations","minValue":null,"viewWindowMode":null,"viewWindow":null,"maxValue":null},"vAxes":[{"useFormatFromData":true,"title":"Dues (dollars)","minValue":null,"logScale":false,"viewWindow":{"max":null,"min":null},"maxValue":null},{"useFormatFromData":true,"minValue":null,"logScale":false,"viewWindow":{"max":null,"min":null},"maxValue":null}],"booleanRole":"certainty","title":"Average dues for each head-tail sequence","height":250,"domainAxis":{"direction":1},"legend":"right","focusTarget":"series","useFirstColumnAsDomain":true,"isStacked":false,"tooltip":{}},"state":{},"view":{"columns":[{"calc":"stringify","sourceColumn":0,"type":"string"},1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]},"isDefaultVisualization":false,"chartType":"ColumnChart","chartName":"Chart 1"} </script>

The head-tail sequences are sorted alphabetically, so the spikes on either end (around $60) are HHHHH and TTTTT. I also find it useful to view the data sorted according to the least cost of dues, as in this table from the Monte Carlo simulation with 100,000 iterations:

<center>
<table class="gridtable">
    <tr><th>Sequence</th> <th>Dues ($)</th> <th> </th> <th>Sequence</th> <th>Dues ($)</th></tr>
    <tr><td>HHHHT</td> <td> 31.89441</td> <td> </td> <td>HHTTH</td> <td> 33.95109</td></tr>
    <tr><td>TTTHH</td> <td> 31.92716</td> <td> </td> <td>THHHT</td> <td> 33.96559</td></tr>
    <tr><td>HTTTT</td> <td> 31.93697</td> <td> </td> <td>TTTHT</td> <td> 33.97174</td></tr>
    <tr><td>HHHTT</td> <td> 31.9726</td> <td> </td> <td>THTTT</td> <td> 34.00494</td></tr>
    <tr><td>HTHTT</td> <td> 31.97717</td> <td> </td> <td>HTHHH</td> <td> 34.0429</td></tr>
    <tr><td>HHTHT</td> <td> 31.98652</td> <td> </td> <td>THHTT</td> <td> 34.11864</td></tr>
    <tr><td>TTTTH</td> <td> 32.00329</td> <td> </td> <td>HTTHT</td> <td> 35.93113</td></tr>
    <tr><td>TTHHH</td> <td> 32.02012</td> <td> </td> <td>THTTH</td> <td> 36.01681</td></tr>
    <tr><td>TTHTH</td> <td> 32.02634</td> <td> </td> <td>HTHHT</td> <td> 36.07967</td></tr>
    <tr><td>THHHH</td> <td> 32.02798</td> <td> </td> <td>THHTH</td> <td> 36.16804</td></tr>
    <tr><td>HHTTT</td> <td> 32.04128</td> <td> </td> <td>TTHTT</td> <td> 37.68822</td></tr>
    <tr><td>THTHH</td> <td> 32.07216</td> <td> </td> <td>HHTHH</td> <td> 38.20029</td></tr>
    <tr><td>HTTTH</td> <td> 33.83344</td> <td> </td> <td>THTHT</td> <td> 42.09793</td></tr>
    <tr><td>TTHHT</td> <td> 33.86829</td> <td> </td> <td>HTHTH</td> <td> 42.23329</td></tr>
    <tr><td>HHHTH</td> <td> 33.87797</td> <td> </td> <td>TTTTT</td> <td> 61.72025</td></tr>
    <tr><td>HTTHH</td> <td> 33.9436</td> <td> </td> <td>HHHHH</td> <td> 61.97057</td></tr>
</table>
</center>

So for many head-tail combinations, the yearly dues are about $32. However, it seems that getting five heads in a row or five tails in a row is significantly more difficult than other combinations. So it does, in fact, matter which sequence I select. I want to avoid HHHHH and TTTTT.

##Problem 2##

The second problem is:

> Now you have entered your first CFA tournament, facing your first opponent. Each of you will pick a different head-tail sequence of length five, and a coin will be flipped repeatedly. Whoever's sequence arises first is the winner. You have the option of choosing first. What sequence should you pick?

Again, my intuition for this problem indicates that my choice should not matter. However, the results of the Monte Carlo simulation for problem suggest that both HHHHH and TTTTT are poor choices. Since they require more flips to occur, they are probably less likely to occur in a sequence of flips first.

For this simulation, I compared each of the 32 possible head-tail sequences against all of the other head-tail sequences in a simulated tournament for each iteration. I ran the simulation using 10, 100, 1,000, and 10,000 iterations, and determine how often each sequence won the tournament. The results are shown in this chart (the full data are available [here](https://docs.google.com/spreadsheet/pub?key=0Aviq84mNTIzZdHBfblhIYmdwenBLY3JUWmdfXzNVMmc&single=true&gid=2&output=html)):

<script type="text/javascript" src="//ajax.googleapis.com/ajax/static/modules/gviz/1.0/chart.js"> {"dataSourceUrl":"//docs.google.com/spreadsheet/tq?key=0Aviq84mNTIzZdHBfblhIYmdwenBLY3JUWmdfXzNVMmc&transpose=1&headers=1&range=A1%3AE33&gid=2&pub=1","options":{"vAxes":[{"useFormatFromData":true,"title":"Percent of games won","minValue":null,"viewWindow":{"max":null,"min":null},"maxValue":null},{"useFormatFromData":true,"minValue":null,"viewWindow":{"max":null,"min":null},"maxValue":null}],"titleTextStyle":{"bold":true,"color":"#000","fontSize":16},"booleanRole":"certainty","title":"Best head-tail sequence for a coin flipping tournament","height":250,"animation":{"duration":0},"legend":"right","width":640,"useFirstColumnAsDomain":true,"hAxis":{"useFormatFromData":true,"title":"Number of iterations","minValue":null,"viewWindowMode":null,"viewWindow":null,"maxValue":null},"isStacked":false,"tooltip":{"trigger":"none"},"focusTarget":"series"},"state":{},"view":{"columns":[{"calc":"stringify","type":"string","sourceColumn":0},1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]},"isDefaultVisualization":false,"chartType":"ColumnChart","chartName":"Chart 2"} </script>

As expected, both HHHHH and TTTTT are poor choices, winning least often. Again, sorting the data (for 10,000 iterations) according to which sequence wins most often is interesting:

<center>
<table class="gridtable">
    <tr><th>Sequence</th> <th>Chance of winning</th> <th> </th> <th>Sequence</th> <th>Chance of winning</th></tr>
    <tr><td>HTTTT</td> <td>0.9699</td> <td> </td> <td>HTTHH</td> <td>0.6451</td></tr>
    <tr><td>HHTTT</td> <td>0.774</td> <td> </td> <td>HHTTH</td> <td>0.6448</td></tr>
    <tr><td>THTTT</td> <td>0.7429</td> <td> </td> <td>TTHTH</td> <td>0.6444</td></tr>
    <tr><td>HTHTT</td> <td>0.7068</td> <td> </td> <td>TTHTT</td> <td>0.6443</td></tr>
    <tr><td>HHHTT</td> <td>0.6997</td> <td> </td> <td>TTHHH</td> <td>0.6292</td></tr>
    <tr><td>HHTHT</td> <td>0.6791</td> <td> </td> <td>TTHHT</td> <td>0.6291</td></tr>
    <tr><td>HHHHT</td> <td>0.6676</td> <td> </td> <td>THHTH</td> <td>0.621</td></tr>
    <tr><td>THHTT</td> <td>0.6675</td> <td> </td> <td>THTTH</td> <td>0.6203</td></tr>
    <tr><td>THHHH</td> <td>0.6525</td> <td> </td> <td>HHTHH</td> <td>0.6112</td></tr>
    <tr><td>THHHT</td> <td>0.6488</td> <td> </td> <td>TTTHH</td> <td>0.6014</td></tr>
    <tr><td>HTHHT</td> <td>0.6488</td> <td> </td> <td>HTHTH</td> <td>0.6014</td></tr>
    <tr><td>HTTHT</td> <td>0.6487</td> <td> </td> <td>TTTHT</td> <td>0.5957</td></tr>
    <tr><td>THTHH</td> <td>0.6487</td> <td> </td> <td>THTHT</td> <td>0.5934</td></tr>
    <tr><td>HTHHH</td> <td>0.6475</td> <td> </td> <td>TTTTH</td> <td>0.4971</td></tr>
    <tr><td>HHHTH</td> <td>0.6472</td> <td> </td> <td>HHHHH</td> <td>0.4944</td></tr>
    <tr><td>HTTTH</td> <td>0.6467</td> <td> </td> <td>TTTTT</td> <td>0.4941</td></tr>
</table>
</center>

I'm surprised to see that the HTTTT sequence wins so often, almost 97% of the time! Without a clear analytic proof of this result, I have to suspect that my utility is flawed somehow so that this sequence seems to win more often. However, I cannot detect the problem with the utility.

##Problem 3##

The third problem is:

> Following the tournament (which you win), you are offered a side bet. You pay $1 and flip a coin 100 times; if you get exactly 50 heads, you win $20 (minus your dollar). If you lose, you are out only the $1. Even so, should you take the bet?

My intuition is that although each sequence of 100 flips should contain 50 heads (since each flip has a one out of two chance of being a head), I doubt we can really count on that holding true. The problem indicates this as well, providing me with twenty-to-one odds. So if just one of out twenty sequences of 100 flips contains exactly 50 heads, I still break even. This seems like a good bet, but I decided to test it.

For each iteration of the Monte Carlo simulation for this problem, my utility will perform 100 flips and count the number of heads 1000 times. After each sequence of 100 flips, the total amount of money both paid into and out of the bet is accumulated. So if the total winnings for any iteration are more than $1000 dollars, then that iteration is considered a good bet. I ran the simulation using 1, 10, and 100 iterations. Here are the results:

<center>
<table class="gridtable">
    <tr><th>Iterations</th> <th>Good Bets</th></tr>
    <tr><td>1</td> <td>0</td></tr>
    <tr><td>10</td> <td>0</td></tr>
    <tr><td>100</td> <td>2</td></tr>
</table>
</center>

After winning only 2% of the time in the best case, I can be sure that I won't take this bet.

##Are these results correct?##
These results are certainly surprising, and they don't line up with my intuition in most cases. My inability to solve these problems analytically lead me to perform Monte Carlo simulations of them. I'm interested to see the correct analytic solutions in the December 2013 CACM issue, so that I can determine if these simulations are accurate.
