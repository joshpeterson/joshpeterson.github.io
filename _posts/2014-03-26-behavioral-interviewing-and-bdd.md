---
layout: post
title: Behavioral Interviewing and BDD
---
I recently had the opportunity to take a course offer by the ANSYS human resources department in the art of behavioral interviewing. I was struck by the similarities between behavioral interviewing techniques and [Behavior Driven Development](http://en.wikipedia.org/wiki/Behavior-driven_development). As I thought about the similarities a bit more though, they began to make sense.

<a href="http://xkcd.com/1293/">![Funny xkcd comic](/static/images/behavioral-interviewing-and-bdd/job_interview.png "When you talk about the job experience you&#39;ll give me, why do you pronounce &#39;job&#39; with a long &#39;o&#39;? (Used under the Creative Commons Attribution-NonCommercial 2.5 License)")</a>

## Behavioral interviewing model
Each question in the behavioral interviewing model follows the same three-part pattern:

* Situation - What were the details of the situation?
* Action - What did the candidate do as a result of the situation?
* Result - What was the outcome of the situation?

The goal of these questions is to quickly gain clarity about how a potential employee might act in the given situation.

## Behavior Driven Development
Behavior Driven Development is driven by scenarios that are usually defined by someone with a customer focus. Each scenario follows a three-part pattern:

* Given some initial state
* When an action occurs
* Then the outcome is some known response

BDD is often most useful in defining requirements, since it focuses an often complex system on one clear situation with a well-understood outcome. Like the behavioral interviewing model, BDD follows a rather strict three-part pattern. But the similarities don't end there.

## A hierarchy of complexity
I've written before about the connection between the [scientific method and programming](/the-scientific-method-and-programming). We can view this relationship in another way be examining the complexity of the object being studied. Consider this table, with the objects of study sorted by descending complexity.

<center>
<table class="gridtable">
    <tr>
        <th>Object of Study</th>
        <th>Attributes of Complexity</th>
    </tr>
    <tr>
        <td>Humans</td>
        <td>Changing rapidly, with a will</td>
    </tr>
    <tr>
        <td>Animals</td>
        <td>Changing, with something like a will</td>
    </tr>
    <tr>
        <td>Plants</td>
        <td>Slowly changing, without will</td>
    </tr>
    <tr>
        <td>Rocks</td>
        <td>Very slowly changing</td>
    </tr>
    <tr>
        <td>Mathematics</td>
        <td>Unchanging, without matter</td>
    </tr>
</table>
</center>

To study (or to perform an experiment on) something near the bottom of the list is much easier than the same action on something near the top of the list. Since Mathematics is unchanging (2+2 will always be 4, $$\pi$$ will always be irrational), I can easily study mathematics. Since it has no matter, I don't even need to study it in the physical world, I can study it in my mind.

Animals and people are a bit more difficult to study, mainly because you need to convince them them to _sit still_. The difficulty in learning something about a person, for example, is setting up the control. Since a person is so complex and rapidly changing, often factors which are not part of the experiment can become involved and muddle the clarity of the results.

> Caveat: Performing an experiment on another person by putting them into a difficult situation like the TV shows [What Would You Do](http://abcnews.go.com/WhatWouldYouDo/) or [Candid Camera](https://www.candidcamera.com/) might make for good TV, but it is probably not a good way to learn about someone with whom you want a meaningful relationship. Just sayin'...

Where does a software requirement fit in this hierarchy of complexity? I believe it is somewhere between the animal and human levels. Certainly a requirement can change rapidly, and although it does not have a will of its own, its creator does have a will. In my experience it is often rather difficult to get a software requirement to sit still.

## Getting someone to sit still
A job interview is something very much like an experiment, where the interviewer has a fixed amount of time to learn about a candidate, and make an important decision. The candidate is extremely complex and difficult to know. The behavioral interviewing model has been developed to rather strictly define the situation (the control in the experiment) so as to provide consistent, clear results across many different candidates. Asking the same questions to all candidates in the same way allows the interviewer to fairly compare the candidates' answers, as a scientist compares the results of many experiments.

The situations posed in behavioral interview questions are often contrived and not indicative of cases in the real world; this is by design. The responses to these questions, not the questions themselves, are of the most use to the interviewer.

Behavior driven development follows the same pattern, for the same reason. In order to understand and compare requirements for software development, we need some common control (in the experimental sense of the word), the _given_ part of the statement. By carefully selecting the _when_ statement, we can be certain of the expected result in the _then_ statement. In fact, we can be so certain that we can write an executable test to verify the result.

BDD allows us to take a software requirement, which is notoriously difficult to wrap our minds around, and express its behavior in a repeatable experiment.

In hindsight, its not at all surprising that behavioral interviewing and behavior driven development are so similar. Both were developed to bring clarity and consistency to often difficult tasks.
