---
layout: post
title: More fun with coin flipping
---
In my [last post](fun-with-coin-flipping/) I attempted to solve three coin flipping [puzzles](http://cacm.acm.org/magazines/2013/11/169037-puzzled-coin-flipping/abstract) using Monte Carlo simulation. The [solutions](http://cacm.acm.org/magazines/2013/12/169936-puzzled-solutions-and-sources/abstract) to the puzzles are published, so I'll compare my results to the correct analytic solutions.

##Problem 1##

The first problem is:

> You have just joined the Coin Flippers of America, and, naturally, the amount of your annual dues will be determined by chance. First you must select a head-tail sequence of length five. A coin is then flipped (by a certified CFA official) until that sequence is achieved with five consecutive flips. Your dues is the total number of flips, in U.S. dollars; for example, if you choose HHHHH as your sequence, and it happens to take 36 flips before you get a run of five heads, your annual CFA dues will be $36. What sequence should you pick? HHHHH? HTHTH? HHHTT? Does it even matter?

Although I expected the dues for any sequence to be about $32 dollars, I found that a few sequences (HHHHH and TTTTT) were much more expensive. Both of these choices lead to dues of around $62 dollars. Peter Winkler describes why this occurs in his answer:

> If X is the average time needed to get HHHHH starting fresh, the average of 1+X and 1 is 32. Solving for X yields a startlingly high 62 flips.

So my Monte Carlo simulation correctly predicted this result.

##Problem 2##

The second problem is:

> Now you have entered your first CFA tournament, facing your first opponent. Each of you will pick a different head-tail sequence of length five, and a coin will be flipped repeatedly. Whoever's sequence arises first is the winner. You have the option of choosing first. What sequence should you pick?

My simulation indicated that both HHHHH and TTTTT are poor choices winning least often because they occur least often. My simulation also indicated, rather surprisingly, that HTTTT is the best option. As it turns out, I missed a key part of the problem. Your opponent can know your chosen sequence, and choose his sequence accordingly. My simulation assumed your opponent had no knowledge of your choice. Winkler uses this part of the problem to propose the solution.

> In general, if you pick VWXYZ your opponent crushes you by picking UVWXY, with the right choice of U. If my calculations are correct, you can do no better than, say, HHTHT (one of the good choices in Puzzle 1). Even then, your opponent counters with HHHTH, winning two times out of three.

I added another simulation to the utility which tests this strategy. For each possible combination you can choose, here are the results if your opponent chooses the first four flips from your sequence with a leading 'H':

<center>
<table class="gridtable">
    <tr><th>Sequence</th> <th>Percent of games you win</th> <th> </th> <th>Sequence</th> <th>Percent of games you win</th></tr>
    <tr><td>HHHHT <td></td>50.53%</td> <td>HHTHT <td></td>33.55%</td></tr>
    <tr><td>THTHT <td></td>49.74%</td> <td>HHHTT <td></td>33.39%</td></tr>
    <tr><td>THTHH <td></td>42.56%</td> <td>HHTTT <td></td>33.29%</td></tr>
    <tr><td>HTHHT <td></td>41.37%</td> <td>HHTTH <td></td>33.23%</td></tr>
    <tr><td>HTHHH <td></td>41.36%</td> <td>HTTTT <td></td>32.96%</td></tr>
    <tr><td>THHTH <td></td>40.57%</td> <td>HHHTH <td></td>32.96%</td></tr>
    <tr><td>TTTHT <td></td>38.76%</td> <td>HHTHH <td></td>32.8%</td></tr>
    <tr><td>TTHTH <td></td>38.22%</td> <td>HTTTH <td></td>32.42%</td></tr>
    <tr><td>TTHTT <td></td>38.22%</td> <td>HTTHT <td></td>30.99%</td></tr>
    <tr><td>TTHHT <td></td>37.86%</td> <td>THTTH <td></td>29.7%</td></tr>
    <tr><td>THHHH <td></td>37.48%</td> <td>THTTT <td></td>29.15%</td></tr>
    <tr><td>THHHT <td></td>37.04%</td> <td>HTHTT <td></td>26.37%</td></tr>
    <tr><td>TTTHH <td></td>36.98%</td> <td>HTHTH <td></td>22.73%</td></tr>
    <tr><td>HTTHH <td></td>36.64%</td> <td>TTTTH <td></td>6.28%</td> </tr>
    <tr><td>TTHHH <td></td>36.38%</td> <td>TTTTT <td></td>3.13%</td></tr>
    <tr><td>THHTT <td></td>34.19%</td></tr>
</table>
</center>

Here are the results if your opponent chooses the first four flips from your sequence with a leading 'T':

<center>
<table class="gridtable">
    <tr><th>Sequence</th> <th>Percent of games you win</th> <th> </th> <th>Sequence</th> <th>Percent of games you win</th></tr>
    <tr><td>TTTTH <td></td>50.18%</td> <td>TTTHT <td></td>34.44%</td></tr>
    <tr><td>HTHTH <td></td>49.85%</td> <td>THHHH <td></td>34.08%</td></tr>
    <tr><td>THTTH <td></td>42.09%</td> <td>TTHHH <td></td>33.49%</td> </tr>
    <tr><td>THTTT <td></td>42.0%</td>  <td>TTHHT <td></td>33.3%</td></tr>
    <tr><td>HTHTT <td></td>41.55%</td> <td>TTHTH <td></td>32.98%</td></tr>
    <tr><td>HTTHT <td></td>40.25%</td> <td>TTHTT <td></td>32.88%</td></tr>
    <tr><td>HHTTT <td></td>38.1%</td>  <td>TTTHH <td></td>32.73%</td></tr>
    <tr><td>HHHTT <td></td>38.04%</td> <td>THHHT <td></td>32.36%</td></tr>
    <tr><td>HHTHH <td></td>37.66%</td> <td>THHTH <td></td>31.32%</td></tr>
    <tr><td>HHTHT <td></td>37.34%</td> <td>HTHHT <td></td>29.2%</td></tr>
    <tr><td>HTTTT <td></td>37.04%</td> <td>HTHHH <td></td>28.77%</td></tr>
    <tr><td>HTTTH <td></td>36.79%</td> <td>THTHH <td></td>26.88%</td></tr>
    <tr><td>HHHTH <td></td>36.73%</td> <td>THTHT <td></td>22.83%</td></tr>
    <tr><td>HHTTH <td></td>36.4%</td>  <td>HHHHT <td></td>6.05%</td></tr>
    <tr><td>THHTT <td></td>36.21%</td> <td>HHHHH <td></td>2.91%</td></tr>
    <tr><td>HTTHH <td></td>35.06%</td></tr>
</table>
</center>

Clearly, if you opponent is blindly following one or the other strategy, your best option is to choose either HHHHT or TTTTH. I suspect that your opponent will be smart enough to choose the appropriate leading flip to give you almost no chance to win. As Winkler mentions, your best option is to choose one of the sequences in the middle, which gives the best results for both cases. He suggests HHTHT, which wins about 1 of 3 times.

##Problem 3##

The third problem is:

> Following the tournament (which you win), you are offered a side bet. You pay $1 and flip a coin 100 times; if you get exactly 50 heads, you win $20 (minus your dollar). If you lose, you are out only the $1. Even so, should you take the bet?
