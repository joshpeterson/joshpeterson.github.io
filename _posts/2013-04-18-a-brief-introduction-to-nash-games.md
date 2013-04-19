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

$$J_1(x_N,y_N) \le J_1(x_N,y) \forall y \in Y$$

Where $$X$$ is the set of all possible values of $$x$$ and $$Y$$ is the set of all possible values of $$y$$. In other words, if player 2 chooses a certain value of $$y$$, player 1 will choose the least value of $$x$$ in the corresponding column.

The game play might proceed like this:

1. Player 2 choose $$y_1$$, so player 1 chooses $$x_3$$
2. Player 2 then reacts by choosing $$y_2$$, so player 1 changes to $$x_1$$
3. Player 2 is unwilling to change, since $$J_2$$ does not have any values for $$x_1$$ lower than 1.2

The game has reached a point where neither player will change their input. This is called the Nash equilibrium. We say that $$\left\{x_1, y_2\right\}$$ is a Nash solution.
