---
layout: post
title: Improving Scalability in Clojure
---
In my [last post]({% post_url 2013-04-23-scalability-in-a-functional-language %}) I compared the scalability of a CPU-bound algorithm in both C++ and Clojure. Although the Clojure implementation had no real data sharing, it used significantly more memory than necessary, which lead to false sharing, and limited the scalability of the implementation. In this post, I'll explain my attempts to improve the scalability of the Clojure implementation by limiting its memory usage.

##TL;DR##
I was unable to significantly lessen the memory usage of the Clojure implementation. By comparing the Clojure implementation on both the JVM and the CLR, it seems clear that less memory usage leads to fewer cache misses, and better scalability. Since this algorithm has no intrinsic data sharing, and can be implemented to scale effectively in an imperative language without too much difficulty.

##Stay Lazy##
One of the most important tools provided by Clojure is the [lazy sequence](http://clojure.org/sequences). A sequence of all prime numbers, for example, doesn't actually store all prime numbers. Instead, it provides each prime number as the client asks, computing the next prime only when necessary. Certain actions in Clojure can limit the ability of the language to be lazy, requiring it to iterate large sequences and store the results in memory.

The partitioning function in my original implementation in Clojure suffered from this exact problem. The partitioning function is responsible for the separation of the input (large large sequence of consecutive integers, often millions of integers) into equally sized groups. Each thread will operate on one group. The original code for the partitioning function looks like this:

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

Here <code>games</code> is a lazy sequence of all integers from 0 to the number of games. The <a href="http://clojuredocs.org/clojure_core/1.3.0/clojure.core/partition-all"><code>partition-all</code></a> function iterates all of the integers and creates subsequences of a given size. Instead of using the laziness of Clojure sequences to minimize the memory usage for these large sequences, this implementation requires all of the integers to be stored in memory.

##Thinking Functionally##
Unfortunately, I find myself continuing to think in imperative languages even when I'm writing code in functional languages. So I found it useful to express this code in an imperative language to help me determine how to improve it.

> Digression:
>
> In high school, I remember talking with an exchange student from Brazil one day. He was very happy, since he had dreamt in English for the first time the previous night. This was an indication that he was beginning to think in English, instead of translating from English to Portuguese in his mind. This allowed him to think faster.
>
> For the same reason, I often feel that I'm thinking to slowly while writing code in a functional language.

If I express the code for the <code>partition-all</code> function in C++, it might look like this:

{% highlight c++%}
vector<vector<int>> partition-all(int partition_size,
                                  int number_of_games)
{
    vector<vector<int>> partitions;
    vector<int> current_partition;
    int entries_in_current_partition = 0;
    for (int i = 0; i < number_of_games; ++i)
    {
        if (entries_in_current_partition < partition_size)
        {
            current_partition.push_back(i);
            ++entries_in_current_partition;
        }
        else
        {
            partitions.push_back(current_partition);
            current_partition.clear();
            entries_in_current_partition = 0;
        }
    }

    return partitions;
}
{% endhighlight %}

When the code is expressed this way, I can clearly see that it will use a signifigant amount of memory, storing each of the consecutive integers. Instead, it should only store the start and end index of each partition. Here is a better implementation in C++:

{% highlight c++%}
vector<pair<int, int>> partition-all(int partition_size,
                                     int number_of_games)
{
    vector<pair<int, int>> partitions_indices;
    int entries_in_current_partition = 0;
    int current_start_index = 0;
    int current_end_index = 0;
    for (int i = 0; i < number_of_games; ++i)
    {
        if (entries_in_current_partition < partition_size)
        {
            ++current_end_index;
            ++entries_in_current_partition;
        }
        else
        {
            partitions_indices.push_back(
                    make_pair(current_start_index,
                              current_end_index));
            current_start_index = current_end_index + 1;
            ++current_end_index;
            entries_in_current_partition = 0;
        }
    }

    return partition_indices;
}
{% endhighlight %}

The corresponding code in Clojure to return a sequence of only the start and end indices for each partition is this:

{% highlight clojure %}
(map #(conj [%] (+ % (- entries-per-partition 1)))
 (filter #(and (>= (- number-of-games %)
                   entries-per-partition)
               (= 0 (mod % entries-per-partition)))
          (range number-of-games)))
{% endhighlight %}

I often find that I understand Clojure code when I think about it backwards, using the REPL to unroll the meaning of each statement. Let's consider this code for a 2x2 game (16 possible games) with partitions of size 4.

{% highlight clojure %}
nash-clojure.core=> (range 16)
(0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15)
{% endhighlight %}

This part of the code builds a lazy sequence of the values to iterate. It corresponds to the for loop in the C++ implementation.

{% highlight clojure %}
nash-clojure.core=> (filter #(and (>= (- 16 %) 4)
                 =>               (= 0 (mod % 4))) (range 16))
(0 4 8 12)
{% endhighlight %}

The next part of the code finds the starting index of each partition. Since we don't use mutable state in Clojure, we cannot walk the end index of each partition as we do in C++. Instead, we do the reverse (in some sense), and pick off the start index of each partition from the sequence of all indices.

{% highlight clojure %}
nash-clojure.core=> (map #(conj [%] (+ % (- 4 1)))
                 =>      '(0 4 8 12))
([0 3] [4 7] [8 11] [12 15])
{% endhighlight %}

Finally, the code [conjoins](http://clojuredocs.org/clojure_core/clojure.core/conj) each start index with the corresponding end index by adding the partition size minus one to each start index. The result is a sequence of pairs, with each pair representing the start and end indices of a partition.

##The Results##
The aim of these changes was to decrease the memory usage of the Clojure implementation, and hopefully improve the scalability of the implementation. The memory usage was measured using Process Explorer for a 5x5 game using one thread. Recall that the C++ implementation of the algorithm used only 1.7 MB of memory, while the initial Clojure implementation used 3.3 GB of memory.

###Improved Implementation in Clojure###

The improved Clojure implementation does indeed use less memory, consuming 2.5 GB. However, the memory usage is still significantly higher than the C++ implementation. Did this change improve the scalability of the implementation?

<a href="https://docs.google.com/spreadsheet/pub?key=0Aviq84mNTIzZdFlfMjdqaWNCSHBEQ3NYcFFPNTQyc2c&single=true&gid=4&output=html">![Nash Clojure implementation (with memory fix) run times chart](/static/images/improving-scalability-in-clojure/nash-clojure-fix-memory-run-times.png "Nash Clojure implementation (with memory fix) run times - follow the link to see the raw data.")</a>

It looks like the scalability is not improved, so the high memory usage is likely still leading to false sharing.

###Improved Implementation in Clojure CLR###

Still uncertain about whether the memory usage stemmed from my implementation, Clojure itself, or the JVM, I also tested this Clojure implementation using the [Clojure CLR](https://github.com/clojure/clojure-clr) port, which is an implementation of Clojure on the .NET runtime. I made a few changes, only replacing calls to Java with calls to C# in my code and the Clojure libraries I used. The Clojure CLR implementation of this algorithm is available [here](https://github.com/joshpeterson/nash-clojure/tree/CLR).

The memory usage pattern for Clojure CLR is rather different from the JVM implementation. Where the JVM implementation used a relatively constant amount of memory throughout the run, the CLR implementation started with a smaller memory footprint that continually increased. For the same problem size (5x5 games with one thread), the CLR implementation started off using 42 MB of memory, and increased to a maximum of 396 MB.

Although the memory usage was much less for the CLR implementation, the wall clock run time was much longer. To measure the scalability of the CLR implementation, I had to use an even smaller game size, 4x4 games. The chart below shows the scalability of the CLR implementation.

<a href="https://docs.google.com/spreadsheet/pub?key=0Aviq84mNTIzZdFlfMjdqaWNCSHBEQ3NYcFFPNTQyc2c&single=true&gid=6&output=html">![Nash Clojure CLR implementation run times chart](/static/images/improving-scalability-in-clojure/nash-clojure-clr-run-times.png "Nash Clojure CLR implementation run times - follow the link to see the raw data.")</a>

This implementation shows slightly better scalability than the JVM implementation, but it is still not nearly linear scalability, which I would expect from an algorithm with no intrinsic data sharing.

###Cache Misses###
Last time, I surmised that the increased memory usage of the Clojure implementation may have lead to more cache misses than the C++ implementation, which in turn caused the scalability to suffer. I again measured the L2 and L3 cache misses with Intel VTune for the new JVM and CLR implementations. The data obtained are shown below:

<center>
<table class="gridtable">
    <tr>
        <th></th>
        <th>C++</th>
        <th>Clojure</th>
        <th>Clojure (memory fix)</th>
        <th>Clojure (CLR)</th>
    </tr>
    <tr>
        <td>L2 cache miss percentage</td>
        <td>0.95%</td>
        <td>8.16%</td>
        <td>6.10%</td>
        <td>2.62%</td>
    </tr>
    <tr>
        <td>L3 cache miss percentage</td>
        <td>0.01%</td>
        <td>4.19%</td>
        <td>3.19%</td>
        <td>2.73%</td>
    </tr>
</table>
</center>

The improved Clojure algorithms do use less memory, and see fewer cache misses. The improved Clojure JVM implementation still uses a significant amount of memory, and as such, only has slightly fewer cache misses than the original JVM implementation.

Do these cache miss measurements correspond to improved scalability?

###Scalability Comparison###
To have a better view of the differences in scalability between these four implementations, I calculated the percent error between the expected linear scalability wall clock time and the actual wall clock time for each number of threads. The chart below shows the comparison.

<a href="https://docs.google.com/spreadsheet/pub?key=0Aviq84mNTIzZdFlfMjdqaWNCSHBEQ3NYcFFPNTQyc2c&single=true&gid=8&output=html">![Comparison of scalability chart](/static/images/improving-scalability-in-clojure/scalability-comparison.png "Scalability comparison - follow the link to see the raw data.")</a>

With the lack of actual data sharing, and the small memory footprint of the C++ implementation preventing false sharing, the imperative implementation maintains a consistent error of about 4% worse than linear scalability.

It is more interesting, I think, to compare the Clojure JVM and CLR implementations. Although the CLR implementation is significantly slower (in wall clock time) than the JVM implementations, it does exhibit scalability closer to the ideal linear scalability. In the JVM, both the original Clojure implementation and the one with less memory exhibit nearly identical scalability.

For this algorithm then, it seems that scalability is related to memory usage, and more specifically, to cache misses. The smaller the memory footprint, the smaller the time spent by the implementation waiting on cache misses, and the better the scalability.

##Conclusion##
After this analysis, it seems the Clojure may not have been a good candidate to measure the scalability of this algorithm in a functional language. Clojure is a dynamic language, in the same family as Ruby or Python. It removes control of memory usage from the developer _by design_. Both of the Clojure JVM implementations used much less memory on my laptop (where less memory is available) than on the desktop machine I used for testing. For many applications, this design decision is acceptable and often beneficial. Still, I suspect a more experienced Clojure developer could further improve the memory usage of my implementation, and therefore improve the scalability as well.

Scalability is difficult to achieve. An algorithm with no intrinsic data sharing can be implemented to scale in an imperative or functional language with little difference. Since the algorithm doesn't require mutable state, the benefits of eliminating mutable state are not a significant advantage for the functional language.

More common cases will likely involve algorithms with data sharing, where mutable state can lead to contention in an imperative language. In these cases, functional languages, and features like Clojure's software transactional memory, will often be beneficial.

