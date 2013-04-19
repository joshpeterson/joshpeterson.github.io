---
layout: post
title: A brief introduction to Nash games
---

Nash games describe a branch of game theory where two evenly matched players compete to each minimize an objective function by choosing from a fixed set of input values.

Suppose Player 1 has one control variable $$x$$, which can take on values or $$x_1$$, $$x_2$$, or $$x_3$$. Likewise Player 2 has one control variable $$y$$, which can take on values $$y_1$$, $$y_2$$, or $$y_3$$. The objective functions for players 1 and 2 are $$J_1$$ and $$J_2$$, respectively. The game below shows the values of the objective functions for each combination of $$x_i$$, $$y_i$$.

$$
\begin{array}{c|cccc}
        &     &          & P_2      &          \\
    \hline
        &     & y_1      & y_2      & y_3      \\
        & x_1 & 5.3, 7.8 & 3.8, 1.2 & 5.7, 1.4 \\
    P_1 & x_2 & 9.6, 3.1 & 8.7, 4.0 & 3.5, 2.1 \\
        & x_3 & 3.4, 9.8 & 4.6, 3.9 & 2.2, 5.6
\end{array}
$$

So in this example $$J_1(x_1,y_1) = 5.3$$ and $$J_2(x_1,y_1) = 7.8$$. In most games both players attempt to minimize their respective object functions. A Nash solution is some $$\left\{x_N, y_N\right\}$$ such that both of these relationships are true:

$$J_1(x_N,y_N) \le J_1(x,y_N) \forall x \in X$$

$$J_2(x_N,y_N) \le J_2(x_N,y) \forall y \in Y$$

Where $$X$$ is the set of all possible values of $$x$$ and $$Y$$ is the set of all possible values of $$y$$. In other words, if player 2 chooses a certain value of $$y$$, player 1 will choose the least value of $$x$$ in the corresponding column.

The game play might proceed like this:

1. Player 2 choose $$y_1$$, so player 1 chooses $$x_3$$
2. Player 2 then reacts by choosing $$y_2$$, so player 1 changes to $$x_1$$
3. Player 2 is unwilling to change, since $$J_2$$ does not have any values for $$x_1$$ lower than 1.2

The game has reached a point where neither player will change their input. This is called the Nash equilibrium. We say that $$\left\{x_1, y_2\right\}$$ is a Nash solution.

We can place any game into one of the following three categories:

* Games with no Nash solutions
* Games with exactly one Nash solution
* Games with more than one Nash solution

It turns out that we can categorize games this way without knowing the objective functions $$J_1$$ and $$J_2$$. We need to know only the least value for $$J_1$$ in each column, and the least value for $$J_2$$ in each row. Since the players are attempting to minimize their objective functions, the other values don't matter. If we represent the least value of $$J_1$$ in each column and the least value of $$J_2$$ in each row with a 1, and make the other values 0, the game above looks like this:

$$
\begin{array}{c|cccc}
        &     &     & P_2 &     \\
    \hline
        &     & y_1 & y_2 & y_3 \\
        & x_1 & 0,0 & 1,1 & 0,0 \\
    P_1 & x_2 & 0,0 & 0,0 & 0,1 \\
        & x_3 & 1,0 & 0,1 & 1,0
\end{array}
$$

Then any $$\left\{x_N, y_N\right\}$$ where $$x_N = 1$$ and $$y_N = 1$$ is a Nash solution. This game has a single Nash solution at $$\left\{x_1, y_2\right\}$$. So no matter which player starts the game, and which input that player initially chooses, the game will always end with player 1 using value $$x_1$$ and player 2 using value $$y_2$$.

For a game of a given size, there are a finite number of possible outcomes. So it is possible to write an algorithm to categorize all of the possible games of a given size into one of the three categories above.

This algorithm is interesting to use in the study of scalability of an implementation to multiple processors. It is not too difficult to write an implementation which is CPU-bound and does not have any real data sharing. That is, the categorization of each game is independent of all other games. Therefore, it should be possible to implement this algorithm so that it scales linearly to any number of processors.
