---
layout: post
title: Hobby Development on Azure
---

For the past few months, I've tried to move all of my hobby development activities
to a VM on Microsoft Azure. The results have been pretty promising. MSDN members
receive free Azure credits each month. This benefit is more than enough to cover
the costs for my development needs.

# The costs

When I first started to try this, I was very confused by the cost structure. Most
of the information available seems to be aimed at use of Azure for servers, so
everything is focused on hourly costs for machines running twenty-four hours per
day. Thankfully, there is information applicable to more piecemeal usage, like
hobby development.

## Virtual machine cost

Azure offers three ways to pay for a VM - Pay As You Go, 1 Year Reserved, and 3
Years Reserved. Since I'm not planning to use this VM all of the time, the Pay As
You Go option works best for hobby development. I found the VM
[pricing](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/)
to make sense.

For my use case, I wanted VMs that with SSD drives for the OS disk. This was a bit
difficult to find initially, but eventually I settled on the Fv2 Series running
Ubuntu Linux. Currently, these VMs are only available in the West US 2 region. If
you don't care about the region of the VM, check each of the available regions -
there may be different VM options in each region.

## Disk cost

I was rather confused by disk cost for a while. The VMs have an OS disk, but is the
data on the disk persistent? Or do I need to also pay for storage? I don't need a
database service like a website might, I just want a normal disk which can
store data over time.

It turns out that each VM can be configured with a different OS disk - with a
certain size and performance characteristics. This disk is persistent, so I can set
up the OS and store in-progress work on it as I would on a local computer. In
Azure, these are called "managed disks", their
[pricing](https://azure.microsoft.com/en-us/pricing/details/managed-disks/) is
again organized by region and type.

I wanted the performance of an SSD, so I'm using a Premium Managed Disk in the West
US 2 region. Hard disk drives are called Standard Managed Disks. Again, options may
vary by region.

# How it all works

Putting this all together, I'm using the following:

1. [Free MSDN
   account](https://azure.microsoft.com/en-us/pricing/member-offers/credit-for-visual-studio-subscribers/),
   with $50/month Azure credit
2. 256 GB Premium Managed Disk (SSD) - $34.56/month
3. Ubuntu VM, F8v2 - $0.358/hour

This configuration lets me use an 8 core machine with 16 GB of RAM. After the OS
disk cost, I have $15.44 to spend each month on the VM. That leaves me with about
43 hours per month of time the F8v2 VM can be running. Azure let's me easily
re-size the VM, so I can switch to a smaller, less expensive one if I start to run
out of credit.

My schedule allows me to spend 3-4 hours on hobby development per week at most, so even with
some wiggle room to let the VM run for a few hours to complete builds, I'm well
under the total monthly credit.

## Shutting down the VM

The key to make all of this work out is shutting down the VM so it is not incurring
costs when not in use. Since I'm the only user on this VM, I don't need to leave it
running like I would a server. Note that the VM must be shutdown via the Azure
portal to make this work. Shutting it down from the Linux command line is not
enough, since Azure will keep its resources in use.

Each time the VM is started, it will get new resources, including a new IP address.
However, the VM can be assigned a host name, so the difference in IP address is not
important for my use case.

## Going over the limits

More than once in the last few months I've accidentally used too many resources,
and went over my monthly budget for the free plan. Thankfully, Azure does not
require a form of payment beyond the free plan. Once the credit is exhausted, VMs
cannot be started until the credit resets next month. All of the configuration and
data on the VM is persisted, so it is easy to start again the next month.

# A great deal

Since I'm only using this VM a few hours per week, Azure is the perfect solution
for my hobby development needs. A comparable physical machine would have
significant up-front cost, and would still not get any more usage than the Azure
VM. I've tried to do hobby development like this with other cloud providers, but
the free plan for Azure offers the most value, by far.
