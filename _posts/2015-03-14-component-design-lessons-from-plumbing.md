---
layout: post
title: Component design - lessons from plumbing
---
Recently my water heater decided to give up the ghost, in a very messy way. As water was pouring from multiple places on its top, I started to wonder how I might replace it, given my serious lack of plumbing skills. During one of my five (!) trips to the local home improvement store the following day, I found this wonderful plumbing component.

![The uber plumbing component](/static/images/component-design-lessons-from-plumbing/uber-component.jpg)

It's difficult to quantify how much time this single component saved me. I think it can be measured in hours. This is a [SharkBite flexible water heater connector with ball valve](http://www.sharkbite.com/product/flexible-water-heater-connectors-with-ball-valves/). As I was installing a new water heater, I thought about what I might learn from this glorious plumbing component (yes, I feel *that* strongly about it).

## Single responsibility

The [Single Responsibility Principle](http://en.wikipedia.org/wiki/Single_responsibility_principle) is well known in software development circles. Still, I often feel a desire to build components that are flexible, and can do more than one thing. After all, I'm spending time building them, they ought to be useful, right? Take another look at this plumbing component. It does *exactly* one thing, and absolutely nothing else. It is designed to connect only to a water heater:

* A 3/4" nut common to water heaters is on one end
* A SharkBite connector designed to work with copper or flexible pipe is on the other end
* Is is flexible, so account for an installer who does not measure exact distances (me)

This plumbing component is utterly useless for pretty much anything else, and that *does not matter*.

## Good interfaces

For a professional plumber, the SharkBite interface is probably a bit of a joke. A plumber will usually solder copper pipe with a torch. This metal bound is excellent, but requires skills and experience that I don't have. For an amateur like me, a push-together connection that requires almost no tools and does not leak is perfect. It is difficult to make a SharkBite plumbing connection incorrectly - the sign of a good interface.

Oh how I would love to have a SharkBite connection on the water heater side of the interface as well. Since it seems unlikely that water heater manufacturers will adopt SharkBite connections anytime soon, this wonderful component compromised where necessary. It adheres to the standard interface to water heaters, without any fuss.

## Key behavior

This single best part of this plumbing component is the built-in ball valve. Hands down, the most important part of any water heater installation is the shut-off valve. I learned this the hard way when my previous water heater died. The built-in valve solves three problems for an amateur:

* It allows me to replace the old shut-off valve.
* It does not require another connection between the valve and the input pipe.
* It provides a simple on/off toggle where I don't need anything else.

Clearly whoever designed this plumbing component new something about water heater installation. They knew which behaviors are necessary, and which ones are not.

## Lessons

The next time I design a software component, I'll be thinking about plumbing. I'll try to design a component that:

* Does exactly one thing
* Works with existing interfaces and defines better ones where possible
* Performs the behaviors its clients want, and no more

More than anything else, choosing the right tool for the job continues to have the biggest impact on the correct the prompt completion of a job. For a professional plumbing, this component is probably useless. For me, it was invaluable.
