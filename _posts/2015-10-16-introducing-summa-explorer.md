---
layout: post
title: Introducing Summa Explorer
---

I'm happy to introduce the personal project I've been working on for the past nine months or so: [Summa Explorer](https://summaexplorer.herokuapp.com). I've enjoyed reading philosophy and theology for some time now. Saint Thomas Aquinas is one of my favorite authors, but I've found the Summa can be difficult to read in book form, mostly because of its sheer size. I wanted to come up with a way to read it that worked better for me, and the Summa Explorer is the result.

## Highly structured

The Summa is a highly structured and regular document. It is divided into _parts_, each part into _treatises_, each treatise into _questions_ and each question into _articles_. Each article then has five parts:

1. A topic to address, stated as a question
2. Common objections to the answer Thomas argues
3. An argument from authority, which always starts with the text "On the contrary"
4. Thomas' argument, which always starts with the text "I answer that"
5. A reply Thomas makes to each of the objections

This structured nature makes the text of the Summa relatively easy to parse. So I wrote a [parser](https://github.com/joshpeterson/summa/tree/master/summa-parser) in Ruby to read the public domain [text](http://www.ccel.org/ccel/aquinas/summa.txt) of the Summa is from the Christian Classics Ethereal Library and generate an in-memory representation of the document in Ruby classes.

## Context and layout

I found two parts of reading the Summa difficult. First, I consistently had trouble remembering the context of a given article. I found myself flipping back pages to see which question or treatise I was reading on a regular basis. Second, I would often read the objections, then forget them by the time I got to the replies section of a given article. I found myself consistently re-reading the objections as well.

I've tried to address these two problems with the Summa Explorer. Each article has a large context section at the bottom of its page. This section gives information about the next and previous articles, as well as the current question, treatise, and part. It also shows the progress through each of these levels of the Summa. I've also listed the objections twice in each article. They are located once where Thomas put them, then again each objection is listed before the reply to it.

I've found that this additional context information and layout helps me to better understand each article.

## Technology

I've never written a Ruby on Rails application before, but I've heard good things about it. As billed, creating an application in Rails was actually a lot of fun, especially for someone with my lack of web development experience. The biggest benefit of Rails for me was a copious amount of documentation available for the *many* simple problems I encountered as a novice. The site is hosted on [Open Shift](https://www.openshift.com/), which has proven to be a nice (and, most importantly, free) hosting platform. The code for the site is available on [Github](https://github.com/joshpeterson/summa), and I'm using [Travis CI](https://travis-ci.org/joshpeterson/summa) for builds.

I've been very impressed with the entire Rails technology stack, and with the availability of these free developer services that work with it. I'm even starting to like Ruby a bit!

