---
layout: post
title: The importance of being your first client
---
In a [previous post](/the-best-way-develop-software/) I listed three arguments in favor of this rather bold statement:

Test Driven Design is always the best technique for software development.

I plan to explore all three arguments by expressing each as a syllogism, and then analyzing the syllogism. This post will explore the second argument:

Test Driven Design requires us to dogfood, making the use of our software easier for our clients.

Here I'm referring to the concept of [eating your own dogfood](http://en.wikipedia.org/wiki/Eating_your_own_dog_food), not to dog food itself.

##Defining the syllogism##
As I explored in an [earlier post](/a-brief-introduction-to-syllogisms/), syllogisms are often a useful tool to analyze a statement or to guide an argument in a productive direction. For this argument, I have written the following syllogism:

<pre>
When we dogfood our code it is easier for our clients to use,

Test Driven Design allows us to dogfood our code,

therefore Test Driven Design allows us to write code which is easier to use for our clients to use.
</pre>

##Terms##
To analyze a syllogism, we first need to agree on the definition of the terms used in the syllogism. Here are my definitions.

* **Dogfood our code:** The action of using our code as our customers would.
* **Code is easier for our clients to use:** The code has clear intent, minimal dependencies, and explicitly states its requirements.
* **Test Driven Design:** The process of
  * Accessing publicly exposed APIs, to write the minimum unit test code to cause a unit test to fail
  * Writing the minimum production code to cause the unit test to pass
  * Iteratively repeating the first two steps to generalize the code

##Premises##
In order for a syllogism to be valid, we must agree that the premises are true. I'll list the two premises separately, and state my justification with each of them.

###Major premise###
When we dogfood our code it is easier for our clients to use.

Here the major term is "code is easier for our clients to use" and the middle term is "dogfood our code".  From experience, usage of my code as my clients would nearly always improves any non-trivial code.

###Minor premise###
Test Driven Design allows us to dogfood our code.

Here the minor term is "Test Driven Design" and the middle term is "dogfood our code". By definition, Test Driven Design is a method of using our code via its API exposed to our customers. 

##Logic##
The conclusion of the syllogism is this statement: "Test Driven Design allows us to write code which is easier for our clients to use." In this simple syllogism, the minor term becomes the subject of the conclusion and the major term becomes the predicate.

##How to disagree##
As with any syllogism, an argument against this conclusion has three grounds for disagreement:

* The terms are not defined correctly
* The premises are not true
* The logic is not valid

For example, I may have defined the terms too narrowly. Maybe a broader definition of some term will render the conclusion less useful, or you may not believe the truth of the major or the minor premise.

##When should we avoid using Test Driven Design?##
Since Test Driven Design often has a higher initial cost than other software development techniques, I believe that we need to determine when this analysis indicates that it should not be used.

Since this syllogism describes why Test Driven Design is beneficial to clients of our public API, then clearly it does not apply when we do not have a public API exposed. How often do we not have a public API? I suspect that we nearly always do. If our code is not consumed by some other developer now, and it is useful, than it likely will be used at some point. Maybe Jeff Bezos was right with his API [mandate](https://plus.google.com/112678702228711889851/posts/eVeouesvaVX).

Maybe if I walk a mile in my clients' shoes, and use my own code, even before they do, then that walk will be a bit easier for them.

_Thanks to a number of my colleagues at ANSYS for their input on this topic._
