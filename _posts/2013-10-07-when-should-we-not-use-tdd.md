---
layout: post
title: When should we not use Test Driven Design?
---
In a [previous post](/the-best-way-develop-software/) I listed three arguments in favor of this rather bold statement:

Test Driven Design is always the best technique for software development.

I have explored all three arguments by expressing each as a syllogism, and then analyzing the syllogism. The intent of these posts was to determine when Test Driven Design is not an appropriate method of software development. Since Test Driven Design is initially more costly than simply writing production software directly, that cost most be weighed against its benefits.

## When does Test Driven Design not apply?##
Based on the analysis of the three syllogisms used to support the statement above, we determined that Test Driven Design should not be used in the following situations:

* When the expected behavior of the software is not known.
* When the software is not to be used by clients or read by other developers.
* When the software is well known and understood, and will not change (across a known API boundary).
* When the software is prohibitively expensive to reliably test (e.g., GUI, multiple processes, multiple threads, non deterministic code, legacy code).
* When the software does not have a public API exposed.
* We do not want to capture the effort used to verify our changes.
  * The code will not change in the future.
  * We are attempting to verify unchanging, working legacy code.
* We do not need to verify the contract for a public API.

## When does Test Driven Design apply?##
If this list encompasses all of the cases where Test Driven Design should not apply, then we should in Test Driven Design in all other cases. The vast majority if the code I have written, both professionally and personally, does not meet and of these criteria. This indicates to me that I should be using Test Driven Design consistently as tool to develop software more effectively.
