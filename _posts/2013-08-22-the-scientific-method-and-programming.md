---
layout: post
title: The scientific method and programming
---

In my [previous post](/the-best-way-develop-software/) I listed three arguments in favor of this rather bold statement:

Test Driven Design is always the best technique for software development.

I plan to explore all three arguments by expressing each as a syllogism, and then analyzing the syllogism. This post will explore the first argument:

Test Driven Design is the application of the scientific method to software development.

##Defining the syllogism##
As I explored in an [earlier post](/a-brief-introduction-to-syllogisms/), syllogisms are often a useful tool to analyze a statement or to guide an argument in a productive direction. For this argument, I have written the following syllogism:

<pre>
The scientific method is the best way to advance technology,

TDD is the application of the scientific method to software development,

therefore TDD is the best way to develop software.
</pre>

##Terms##
To analyze a syllogism, we first need to agree on the definition of the terms used in the syllogism. Here are my definitions of the four terms present here.

* **To advance technology:** The action of harnessing the natural world to perform tasks
* **Scientific method:** The iterative process of carrying out experiments
  * Making a hypothesis
  * Designing an experiment
  * Performing the experiment
  * Refining the hypothesis
* **Software development:** The action of instructing computers to perform tasks
* **Test Driven Design (TDD):** The process of
  * Writing the minimum unit test code to cause a unit test to fail
  * Writing the minimum production code to cause the unit test to pass
  * Iteratively repeating the first two steps to generalize the code

##Premises##
In order for a syllogism to be valid, we must agree that the premises are true. I'll list the two premises separately, and state my justification with each of them.

###Major premise###
The scientific method is the best way to advance technology.

Here the major term is "to advance technology" and the middle term is "scientific method". The rate of technological advancement since the widespread use of the scientific method has proven this premise to be true. The scientific method provides two concrete outcomes which have opened the door for technological advancement.

* The scientific method makes experimental results repeatable.
* The scientific method normalizes the process of performing experiments.

###Minor premise###
TDD is the application of the scientific method to software development.

Here the minor term is "Test Driven Design (TDD)" and the middle term is again "scientific method". This premise is not my idea. Rick Mugridge was the first to propose it, in [this paper](http://agile2003.agilealliance.org/files/P6Paper.pdf). I would recommend reading his paper, it is rather interesting. To summarize, he maps the steps of the scientific method to the steps of the Test Driven Design process.

<center>
<table class="gridtable">
    <tr>
        <th>Scientific Method</th>
        <th>Test Driven Design</th>
    </tr>
    <tr>
        <td>Make a hypothesis</td>
        <td>Determine how the production code could fail</td>
    </tr>
    <tr>
        <td>Design an experiment</td>
        <td>Write the test code to make a failing test</td>
    </tr>
    <tr>
        <td>Perform the experiment</td>
        <td>Run the test code</td>
    </tr>
    <tr>
        <td>Refine the hypothesis</td>
        <td>Fix the production code</td>
    </tr>
</table>
</center>

This one-to-one mapping between the steps of the scientific method and Test Driven Design indicates that TDD is the application of the scientific method to software development.

##Logic##
The conclusion of the syllogism is this statement: "TDD is the best way to develop software". Here the minor term is "TDD" and the major term is "to advance technology".

In order for the logic to be valid, the minor term must be the subject of the conclusion, and the major term must be the object of the conclusion. Therefore, the terms "to advance technology" and "to develop software" must be interchangeable.

I believe they  are interchangeable, since the tasks of software development are a proper subset of the tasks of technological advancement. Then in the conclusion, we can replace the more universal statement (to advance technology) with the more particular statement (to develop software).

##How to disagree##
As with any syllogism, an argument against this conclusion has three grounds for disagreement:

* The terms are not defined correctly
* The premises are not true
* The logic is not valid

For example, I may have defined the terms too narrowly. Maybe a broader definition of some term will render the conclusion less useful. Or you may not believe that TDD is the application of the scientific method to software development. Or possibly, the terms "to advance technology" and "to develop software" are not interchangeable in the conclusion.

##If this is true, what does it mean?##
The benefit of this exercise for me is not so much the conclusion, but rather, a clear definition of times when TDD is not an appropriate software development practice. If I can define all of the times when TDD should not be used, then I also know when it should be used. Then I can convince myself that it is worth the initial effort, even if it seems to take longer to write some piece of software.

So under what conditions would we not use the scientific method?

* When we do not know how to set up the experiment.
* When the results of the experiment do not need to be reproduced or examined by others.
* When the experiment is well known and understood, and will not change.
* When we cannot set up a control for the experiment (e.g. theoretical physics).

Since TDD is the application of the scientific method to software development (the minor premise), we can mention the corresponding conditions which would prevent the use of TDD.

* When the expected behavior of the software is not known.
* When the software is not to be used by clients or read by other developers.
* When the software is well known and understood, and will not change (across a known API boundary).
* When the software is prohibitively expensive to reliably test (e.g., GUI, multiple processes, multiple threads, non deterministic code, legacy code).

For most of the software I develop, none of these conditions hold. Therefore, I should be using TDD most of the time. Other developers may find that most of their development meets one or more of these conditions, so TDD is not the best approach. So it seems that TDD should be applied on a case-be-case basis.

_Thanks to a number of my colleagues at ANSYS for their input on this topic._
