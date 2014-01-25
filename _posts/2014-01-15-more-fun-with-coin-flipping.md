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
