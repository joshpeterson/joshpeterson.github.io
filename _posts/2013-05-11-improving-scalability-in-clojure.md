---
layout: post
title: Improving Scalability in Clojure
---
In my [last post](/scalability-in-a-functional-language/) I compared the scalability of a CPU-bound algorithm in both C++ and Clojure. Although the Clojure implementation had no real data sharing, it used significantly more memory than necessary, which lead to false sharing, and limited the scalability of the implementation. In this post, I'll explain my attempts to improve the scalability of the Clojure implementation by limiting its memory usage.

##Stay Lazy##
One of the most important tools provided by Clojure is the [lazy sequence](http://clojure.org/sequences). A sequence of all prime numbers, for example, doesn't actually store all prime numbers. Instead, it provides each prime number as the client asks, computing the next prime only when necessary. Certain actions in Clojure can limit the ability of the language to be lazy, and instead require it to iterate large sequences like this, and store the results in memory.

The original implementation in Clojure suffered from this exact problem. The partitioning function is responsible for the separation of the input (large large sequence of consecutive integers, often millions of integers) into equally sized groups. Each thread will operate on one group. The original code for the partitioning function looks like this:

{% highlight clojure %}
(defn partition-nash-games
  [number-of-partitions number-of-rows
   number-of-columns games]
  (let [number-of-games
         (number-of-nash-games number-of-rows
                               number-of-columns)
        partitions (partition-all (quot number-of-games
                                        number-of-partitions)
                                  games)]
    (if (= 0 (rem (count games) number-of-partitions))
      partitions
      (conj (take (- (+ number-of-partitions 1) 2) partitions)
            (apply concat (take-last 2 partitions))))))
{% endhighlight %}

Here is the section of this code which prevents Clojure's normal laziness:

{% highlight clojure %}
(partition-all (quot number-of-games number-of-partitions)
               games)]
{% endhighlight %}

Here ```games``` is a lazy sequence of all integers from 0 to the number of games. The ```partition-all```


