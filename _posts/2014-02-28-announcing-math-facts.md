---
layout: post
title: Announcing Math Facts
---
I'm very pleased to announce the availability of a new website I've created - [Math Facts](http://joshpeterson.github.io/mathfacts). The Math Facts site generates math facts practice tests, which allow a child to practice basic facts. Each test consists of fifty problems.

![Math Facts practice test sample](/static/images/announcing-math-facts/mathfacts-test.png)

## The story
My oldest son is currently in first grade. In his class, the students need to complete a test with fifty math facts in two and a half minutes. His school provided a few practice tests, but after a few practices with the same tests, he started to learn the specific problems on those tests. So I decided to make a test generator that would shuffle all of the math facts in a given range.

I've found a few other test generators available on other sites. However, I wanted to generate tests that look like the ones he takes in school, so that he can practice not only the math facts, but also the format. At this age, writing the numbers legibly and quickly is often as much of a challenge as knowing the correct answer.

## The technology
The code for this site is open source, available on [Github](https://github.com/joshpeterson/mathfacts). I didn't want to pay for any server-side hosting, so I decided to use [Dart](http://dartlang.org) to create most of the code for the site. I had not used Dart for any projects before, but I was pleasantly surprised by the experience. The language was easy to learn and the tools for test driven design and debugging are useful. The JavaScript output that is deployed seems to execute without problems on all modern browsers that I have tried.

The math facts themselves are formatted by [MathJax](http://mathjax.org). I've used MathJax on this site and others. It is a wonderful bit of software that does one thing and does it very well.

Since I'm not much of an HTML designer at all, I used [Bootstrap](http://getbootstrap.com) for the site layout and styling. The template for the site is one of the simple Bootstrap examples with only some minor adjustments.

## The future
As my son grows and moves to different math facts (differences, products, and quotients), I hope to add more practice test generators to the site. If you find the site useful, please let me know! It has already been helpful for us.
