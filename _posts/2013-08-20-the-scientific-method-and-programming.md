---
layout: post
title: The scientific method and programming
---

In my [previous post](/the-best-way-develop-software/) I listed three arguments in favor of this rather bold statement.

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
To analyze a syllogism, we first need to agree on the definition of the terms used. Here are my definitions of the four terms used.

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
In order for a syllogism to be valid, we must agree that the premises are true. I'll list each of the two premises separately, and state my justification with each of them.

###Major premise###
The scientific method is the best way to advance technology.

Here the major term is "to advance technology" and the middle term is "scientific method". The rate of technological advancement since the widespread use of the scientific method has proven this premise to be true. The scientific method provides two concrete outcomes which have opened the door for technological advancement.

* The scientific method makes experimental results repeatable.
* The scientific method normalizes the process of performing experiments.

###Minor premise###
TDD is the application of the scientific method to software development.

Here the minor term is "Test Driven Design (TDD)" and the middle term is again "scientific method". Note most importantly, this premise is not my idea. From what I can tell, Rick Mugridge was the first to propose it, in [this paper](http://agile2003.agilealliance.org/files/P6Paper.pdf). I would recommend reading his paper, it is rather interesting. To summarize, he maps the steps of the scientific method to the steps of the Test Driven Design process.

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
The conclusion of the syllogism is this statement "TDD is the best way to develop software". Here the minor term is "TDD" and the major term is "to advance technology".
