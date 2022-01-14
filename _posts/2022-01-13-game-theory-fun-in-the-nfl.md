---
layout: post
title: Game theory fun in the NFL
---
Sunday night's NFL game featured a fun game theory twist. The Los Angeles Chargers
and the Las Vegas Raiders would each make the playoffs if they won the game, but
they would _both_ make the playoffs if they tied. Of course they could have chosen
to kneel down each play of the game, tie 0-0 and be guaranteed a spot in the
playoffs.

That did not happen - we'll see why that is not surprising in a moment. The players
and coaches made hundreds of decisions throughout the game, but at the pivotal
moment, did they make the right decision?

To get a handle on what happened in the game, I recommend Bill Barnwell's great
[summary](https://www.espn.com/nfl/story/_/id/33032641/raiders-win-make-nfl-playoffs-did-chargers-blow-teams-played-tie-wild-ending-explained)
on ESPN.

## The prisoner's dilemma

Before the game started the two teams were faced with the class game theory problem
called [The Prisoner's Dilemma](https://en.wikipedia.org/wiki/Prisoner%27s_dilemma)
(actually it is not _quite_ the same, but we'll fudge the numbers a bit to make it
fit). Basically, both teams could benefit if they can agree and trust each other to
keep the agreement (spoiler alert: they can't).

## Optimization functions

We can define [Nash games](/a-brief-introduction-to-nash-games) like this in terms
of an optimization function for each player, usually named $$J$$. In this case,
the "players" are the Raiders and Chargers, so we'll name the functions $$J_R$$ and
$$J_C$$.

Each team can choose to play for the win or the tie, and the result of the function
will be their seed in the playoffs, either 6 or 7 (spots in the playoffs) or 8 (out
of the playoffs). Each team is aiming to get the lowest value for their function.

For example, if the Raiders play for a win and the Chargers play for a tie, then
the Raiders will win the game and have the 6 seed in the playoffs. Their function
looks like this:

$$J_R(Win,Tie)=6$$

If on the other hand the Raiders play it safe and kneel down each time to tie, but
the Chargers play for the win, the Raiders' function is

$$J_R(Tie,Win)=8$$

and the Raiders are out of the playoffs. We'll list the Raiders' strategy as the
first parmeter to the function and the Chargers' as the second.

Each team has four possble outcomes then. For the Raiders they are:


$$J_R(Win,Win)=6$$

$$J_R(Win,Tie)=6$$

$$J_R(Tie,Win)=8$$

$$J_R(Tie,Tie)=7$$

And for the Chargers:

$$J_C(Win,Win)=6$$

$$J_C(Win,Tie)=8$$

$$J_C(Tie,Win)=6$$

$$J_C(Tie,Tie)=6$$

One note here: if both teams try to win, only one actually will. So they both plan
to get a 6 seed if they win.

These are much easier to visualize in a table:

$$
\begin{array}{c|ccc}
        &     &  Chargers \\
    \hline
        &     & Win & Tie \\
Raiders & Win & 6,6 & 6,8 \\
        & Tie & 8,6 & 7,6
\end{array}
$$

The first entry in each pair of numbers is the Raiders' playoff seed (i.e. function
value). The second entry is the Chargers playoff seed.

We can see very quickly when neither team has an advantage at the start of the
game, if one team starts to play for a tie, by, say, kneeling the ball on their
first possession, then the other team immediately has an incentive to play to win.
So very quickly both teams will play to win, and one of them will not make the
playoffs.

## Reducing the game

We can reduce Nash games like this to be _minimal ordinal_ games, where we rank the
preferences of each player and ignore the actual optimization function values. This
game reduces to this (assuming the Chargers would rather win than tie, even though
they get the 6 seed in the playoffs either way):

$$
\begin{array}{c|ccc}
        &     &  Chargers \\
    \hline
        &     & Win & Tie \\
Raiders & Win & 1,1 & 1,2 \\
        & Tie & 2,1 & 2,2
\end{array}
$$

By reducing this game to its minimal form, we can care only about the 1's in the
table, and can compare it with other 2x2 games that have the same minimal form. The
prisoner's dilemma game (and many others) reduce to this same minimal ordinal game.

The _Nash Equilibrium_ for the game is the cell where two 1's exist. The predicts
the decisions that the players will make, where the game will settle so that no
team is changing there decision. And indeed it did! The teams will not collude to
tie and both make the playoffs.

## The pivotal play

But the _actual_ football game brought even more game theory fun! After
69 minutes of football, the teams were tied with just 38 seconds left in overtime.

The Raiders had the ball at the Chargers' 39 yard line. From here they could kick a
57-yard field goal to win - by no means a sure thing. But they were nearly
guaranteed a tie, and a trip to the playoffs. Would they kneel the ball to run out
the clock, or are they willing to go for the win?

At this point both teams again have two options. The Raiders can try play for the
win and try to move the ball closer for an easier field goal, or they can kneel
down and end the game. The Chargers can stick with their base defense, or call a
time out to put in a run-specific defense to try to stop the Raiders from getting
closer.

The game looks like this, again expressed in terms of playoff seeds:

$$
\begin{array}{c|ccc}
        &     &  Chargers \\
    \hline
        &     & Play & Change \\
Raiders & Run & 6,8 & 6,6 \\
        & Kneel & 7,6 & 7,6
\end{array}
$$

Let's reduce this one a well:

$$
\begin{array}{c|ccc}
        &     &  Chargers \\
    \hline
        &     & Play & Change \\
Raiders & Run & 1,2 & 1,1 \\
        & Kneel & 2,1 & 2,1
\end{array}
$$

The Chargers clearly want the Raiders to kneel down, then no matter what they do,
the Chargers make the playoffs. But if the Raiders kneel, the will get the 7 seed,
and that is pretty much guaranteed at this point. So the Raiders can take the
initiative and go for that 6 seed.

The game has changed now from a Nash game, where the players are balanced, to a
[Stackelberg](https://en.wikipedia.org/wiki/Stackelberg_competition) game, where
one player is the leader, who acts first.

The Raiders are the leader here, and there best option is the execute a play
(likely a low-risk running play, to keep the clock going). Sure enough, they did
not line up in a formation to kneel the ball - they were ready to try to go for the
win. So we forget about the second row in this table - the Raiders will execute a
play. What will the Chargers do?

The Chargers recognized that their current defense did not have the correct
personnel on the field to stop a running play, so their coach called a time out in
order to change the personnel.

At first this seems wrong - why would the Chargers' coach call a timeout and stop
the clock when he wants the game to end in a tie? But recognizing the Raiders
incentive to execute a play and try to gain enough yards to kick a field goal and
win, the Chargers' coach made the correct decision.

In the end, the Raiders ran a play against the Chargers better run defense - and
still gained 10 yards! So although the Chargers made the correct decision, the
execution of the play changed the game again. Now the Raiders can (and did) take a
high-percentage field goal and made it to win the game.

## A counter-factual

What would have happened if the Chargers had the ball in the same situation? The
game would have looked like this:

$$
\begin{array}{c|ccc}
        &     &  Chargers \\
    \hline
        &     & Run & Kneel \\
Raiders & Play & 7,6 & 7,6 \\
        & Change & 7,6 & 7,6
\end{array}
$$

The Chargers could not improve their playoff seeding by running plays to try to get
closer to kick a winning field goal. The Raiders also have no options to improve
their seeding. So they likely would have kneeled the ball, and both team would have
made the playoffs. In a Stackelberg game, being the leader really matters!

## Game theory FTW!

While I doubt the coaches or players were actively doing this kind of analysis
before or during the game, I find it fascinating that game theory correctly
predicted the behavior of the teams both teams.

I wonder what else game theory can predict?

