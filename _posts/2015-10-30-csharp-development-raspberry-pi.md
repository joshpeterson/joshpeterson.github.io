---
layout: post
title: C# development on a Raspberry Pi
---

Recently I've decided to try to set up a C# development environment on my [Raspberry Pi 2](https://www.raspberrypi.org/products/raspberry-pi-2-model-b/) using [Vim](http://www.vim.org) and [OmniSharp](http://www.omnisharp.net/). It has been a long process, so I wanted to document each of the problems I faced (and the solutions) here for the next time I try this.

## The platform
I'm using Raspbian at the following version:

{% highlight bash %}
josh@raspberrypi ~ $ cat /etc/issue
Raspbian GNU/Linux 7 \n \l
josh@raspberrypi ~ $ cat /etc/debian_version
7.8
{% endhighlight %}

I have mono 3.2.8 installed, and I started off with the latest version of Vim available in a package for Raspbian (but we'll see later that had to change).

## The problems
I'll go through each problem I had while I tried to set up an OmniSharp development environment with Vim.

### Problem 1
OmniSharp requires Vim with Python support. After installing [omnisharp-vim](https://github.com/OmniSharp/omnisharp-vim) with [Vundle](https://github.com/VundleVim/Vundle.vim) I saw this error from Vim when I started it:

{% highlight bash %}
Error: OmniSharp requires Vim compiled with +python
{% endhighlight %}

### Fix 1
I found that the vim-nox package is built with Python support, so I installed it.

### Problem 2
When I opened a C# source file and tried to use omni-complete with `<C-x><C-o>` I saw this error:

{% highlight bash %}
Error detected while processing function OmniSharp#Complete:
line   14:
E117: Unknown function: pyeval
Error detected while processing function OmniSharp#Complete:
line   14:
E15: Invalid expression: pyeval('Completion().get_completions("s:column", "a:base")')
{% endhighlight %}

### Fix 2
It turns out that the vim-nox package does not have a new enough version of Vim to use with OmniSharp. It is at version 7.3.547, but OmniSharp uses `pyeval` in Vim, which is at 7.3.569. So I installed Vim from [source](http://www.vim.org/git.php).

### Problem 3
Vim needs to be compiled with Python support (see Problem 1 above).

### Fix 3
I first had to install the `python-dev` package:

{% highlight bash %}
sudo apt-get install python-dev
{% endhighlight %}

Then I followed some good [instructions](http://stackoverflow.com/questions/3373914/compiling-vim-with-python-support) to get Vim built correctly with Python support.

### Problem 4
I next had to make Vim built from sources the default version used on my machine. It installed to `/usr/local/bin`.

### Fix 4
I ran these commands:

{% highlight bash %}
sudo apt-get remove vim vim-runtime gvim
sudo update-alternatives --install /usr/bin/editor editor /usr/local/bin/vim 1
sudo update-alternatives --set editor /usr/local/bin/vim
sudo update-alternatives --install /usr/bin/vi vi /usr/local/bin/vim 1
sudo update-alternatives --set vi /usr/local/bin/vim
{% endhighlight %}
I also had to add /usr/local/bin to my `PATH` environment variable value.

### Problem 5
Ready for everything to work now, I tried omni-complete again. When I did `<C-x><C-o>` and got this error:

{% highlight bash %}
-- Omni completion (^O^N^P) Pattern not found
{% endhighlight %}

It turns out the omnisharp-vim installation via Vundle did not actually build the Omnisharp.exe server.

### Fix 5
I changed to the `~/.vim/bundle/omnisharp-vim/server` directory and ran the xbuild command to build the OmniSharp.exe server.

### Problem 6
I still did not have omni-complete! The OmniSharp server did start automatically from Vim  because I was testing a `.cs` file that was not part of a project and solution file.

### Fix 6
I was able to start the OmniSharp server  manually. It starts automatically if I open Vim with a `.cs` file that is in project and a solution.

### Problem 7
I attempted to set up grunt-init (as recommended on the omnisharp-vim site). I first tried to install the node and npm packages manually.

{% highlight bash %}
sudo apt-get install node
sudo apt-get install npm
{% endhighlight %}

But that does not work, as the npm package is too old.

### Fix 7
So I then followed [these](http://stackoverflow.com/questions/12913141/message-failed-to-fetch-from-registry-while-trying-to-install-any-module) instructions to get a working npm system. Then I could install grunt.

{% highlight bash %}
sudo apt-get purge nodejs npm
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs
sudo npm install -g grunt-init
{% endhighlight %}

## Success!

After these seven problems were solved, I was able to get omni-complete with C# working in Vim on my Raspberry Pi 2. Now to write some code!
