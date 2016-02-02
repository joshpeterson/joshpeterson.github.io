---
layout: post
title: Subtle Bug With 64-bit Native Client
---
I've recent tracked down the cause of a subtle problem with [Google Native Client](https://developer.chrome.com/native-client), using the newlib tool chain to build a 64-bit .nexe file. For some time, I've had problems getting a 64-bit .nexe to load correctly. Unfortunately, I don't have the Native Client tool chain installed on a 64-bit machine, so I was unable to debug the problem using my unit tests. By adding run-time logging to the code, I was able to finally isolate the cause of the problem, so I would like to share it in case others experience the same behavior.

## A std::initializer_list too far##
The problem occurs in code that looks like this:

{% highlight c++ %}
object_repository<T>(initializer_list<pair<string, T> list) {
  for (auto i = list.begin(); i != list.end(); ++i)
    this->add(*i);
}
{% endhighlight %}

This code constructs a simple `object_repository` instance by adding the items from the `std::initializer_list` to it. Using GCC 4.4.3 with the Native Client newlib tool chain, this works well in a 32-bit .nexe. However, I found that a 64-bit .nexe built with the same compiler and standard library implementation did not end the iteration as expected.

In my specific case the `std::initializer_list` had eight items, but the loop continued at least nine times, dereferencing an invalid iterator on the ninth time through the loop.

## A simple work-around##
I was able to work around the problem by providing the constructor with an addition piece of information: the expected number of entries in the list.

{% highlight c++ %}
object_repository<T>(int number_of_entries, initializer_list<pair<string, T> list) {
  int iterations = 0;
  for (auto i = list.begin(); i != list.end(); ++i) {
    this->add(*i);
    ++iterations;
    if (iterations == number_of_entries)
      break;
  }
}
{% endhighlight %}

This code, however, is not nearly as nice. It passes (what should be) unnecessary information to the constructor. But it does solve the problem. If anyone has experienced this problem, and has a better solution, I would love to know about it.

You can find the full code change [here](https://github.com/joshpeterson/osoasso/commit/2a0120c1edbd890aff5a110531660d3610cdf218#diff-04db942be3fe207e6f00d8c546aea0fb).
