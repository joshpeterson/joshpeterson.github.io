---
layout: post
title: You are (probably) already doing TDD
---
In a [previous post](/the-best-way-develop-software/) I listed three arguments in favor of this rather bold statement:

Test Driven Design is always the best technique for software development.

I plan to explore all three arguments by expressing each as a syllogism, and then analyzing the syllogism. This post will explore the third argument:

We are already practicing Test Driven Design, so why not replace ourselves with a small shell script?

## Defining the syllogism
As I explored in an [earlier post](/a-brief-introduction-to-syllogisms/), syllogisms are often a useful tool to analyze a statement or to guide an argument in a productive direction. For this argument, I have written the following syllogism:

<pre>
We verify changes to the code via ad-hoc tests,

Test Driven Design is more productive than ad-hoc testing,

therefore, Test Driven Design is a more productive way to verify changes to the code.
</pre>

## Terms
To analyze a syllogism, we first need to agree on the definition of the terms used in the syllogism. Here are my definitions.

* **Verify changes to the code:** The action of proving to a developer that a given change to the code has the desired impact on the run-time behavior.
* **Ad-hoc tests:** Non-automated verification of some run-time state, via visual inspection in the UI or the debugger
* **Test Driven Design:** The process of
  * Accessing publicly exposed APIs, to write the minimum unit test code to cause a unit test to fail
  * Writing the minimum production code to cause the unit test to pass
  * Iteratively repeating the first two steps to generalize the code

## Premises
In order for a syllogism to be valid, we must agree that the premises are true. I'll list the two premises separately, and state my justification with each of them.

### Major premise#
We verify changes to the code via ad-hoc tests.

Here the major term is "verify changes to the code" and the middle term is "ad-hoc tests". The vast majority of developers I have met never commit changes to production code when they are unsure of the run-time behavior caused by those changes. Prior to exposing changes to our client, we _always_ do some verification.

### Minor premise#
Test Driven Design is more productive than ad-hoc testing.

Here the minor term is "Test Driven Design" and the middle term is "ad-hoc testing". The increased productivity of Test Driven Design comes for a few reasons:

* Test Driven Design captures the effort applied to testing and allows it to be used over and over.
  * One way to  measure the cost of writing a test is to divide the time to write the test by the number of times it is executed.
  * Each time a test is executed, the cost of writing the test decreases.
* Test Driven Design works at the public API level, so it is more specific than ad-hoc testing.
  * All of the test cases can be more clearly determined.
  * The contract with the component (including semantics) can be verified.
* Test Driven Design externalizes the effort applied to testing and allows others to use it.
  * It allows others to change code with confidence.
  * It exposes details about contract for a component to the clients of the component.

## Logic
The conclusion of the syllogism is this statement: "Test Driven Design is a more productive way to verify changes to the code." In this simple syllogism, the minor term becomes the subject of the conclusion and the major term becomes the predicate.

## How to disagree
As with any syllogism, an argument against this conclusion has three grounds for disagreement:

* The terms are not defined correctly
* The premises are not true
* The logic is not valid

For example, I may have defined the terms too narrowly. Maybe a broader definition of some term will render the conclusion less useful, or you may not believe the truth of the major or the minor premise.

## When should we avoid using Test Driven Design?
Since Test Driven Design often has a higher initial cost than other software development techniques, I believe that we need to determine when this analysis indicates that it should not be used. Based on this analysis, we should not use Test Driven Design when:

* We do not want to capture the effort used to verify our changes.
  * The code will not change in the future.
  * We are attempting to verify unchanging, working legacy code.
* We do not need to verify the contract for a public API.

_Thanks to a number of my colleagues at ANSYS for their input on this topic._
