---
layout: post
title: Constraints and greenfield projects
---
I was wondering recently why some greenfield development projects succeed, while other seem to languish. I think that, at least in part, it may have to do with the constraints on the project.

Most of the projects I work on as a professional developer involve a significant number of constraints. I suspect that other developers have a similar experience. Seldom are we asked to change a project or component which does X so that it does Y, but not X. More often, the change requires it to do both X and Y. Once in a while, I have the opportunity to work on greenfield project, where the product or component either doesn't do X, or, in fact, does nothing at all (because it does not exist). Greenfield projects are exiciting, due to the lack of constraints.

At the same time, some in the software development community argue rather strongly that [constraints are liberating](http://gettingreal.37signals.com/ch03_Embrace_Constraints.php). So which is it? Are constaints useful or not?

##More than one type of constraints##
I think we need to distinguish between two different types of constraints, constraints on what to do, and constraints on how to do it.

_What-constraints_ are constraints on the requirements of a project, in the agile development process, they are constraints provided by the customer or stakeholder. These are constraints like "this application must be delivered via the web" or "the component must persist data in a human-readable format".

_How-constraints_ are constraints on the implementation of project. They are often imposed by existing products or components. These are constraints like "the product must use threading library X" or "the project should be written in language Y".

Any project has some balance of constraints of these two types.

##A good balance constraints##
On a greenfield project (or maybe any software development project), it is best to have more what-constraints and fewer how-constraints. In fact, the developers on the project should attempt to maximize the what-constraints and minimize the how-constraints. This balance provides developers with the ability to deliver features quickly and incrementally. The high number of what-constraints allow developers to say no to the development of unnecessary features, while the low number of how-constraints allow developers flexibility to choose the best tools for implementation.

##A poor balance of constraints##
If the balance of constraints is reversed, such that a project has very few what-constraints but many how-constraints, the project will probably be difficult to complete. The lack of what-constraints make it difficult for anyone involved to argue that the project is complete. It will likely be subject to continual scope creep. As the scope of the project increases (or changes entirely), the restrictive how-constraints tend to make it more and more difficult to meet the new requirements.

##Why do I like greenfield projects?##
Most greenfield projects can be defined with a good balance of constraints. Software developers are usually problem-solvers, so if a project can strictly define the problem (the what-constraints), but not restrict the implementation (the how-constraints), the problem-solvers will enjoy working on it. Changes to existing software, on the other hand, usually have signifcant how-constraints, so as a problem-solver, I am more restricted. I prefer a greenfield project with a well-designed balance of constraints.

I believe that the agile development process, where customers are required to define the acceptance criteria for user stories, is an attempt to control this balance of constraints. Experience tells us that a poor balance of constraints may doom a new software development project from the start, while a good balance can free the project to succeed.

