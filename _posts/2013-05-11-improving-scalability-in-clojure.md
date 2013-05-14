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

Here <code>games</code> is a lazy sequence of all integers from 0 to the number of games. The <a href="http://clojuredocs.org/clojure_core/1.3.0/clojure.core/partition-all"><code>partition-all</code></a> function iterates all of the integers and creates subsequences of a given size. Instead of using the laziness of Clojure sequences to minimize the memory usage for these large sequences, this implementation requires all of the integers to be stored in memory. This is one section of code which contributes to the significant memory usage of the implementation.

##Thinking Functionally##
Unfortunately, I find myself continuing to think in imperative languages even when I'm writing code in functional languages. So I found it useful to express this code in an imperative language to help me determine what is wrong with this code.

> Digression:
>
> In high school, I remember talking with an exchange student from Brazil on day. He was very happy, since he had dreamt in English for the first time the previous night. This was an indication that he was beginning to think in English, instead of translating from English to Portuguese in his mind. This allowed him to think faster.
>
> Often I feel that I'm thinking to slowly while writing code in a functional language, for this same reason.

The <code>partition-all</code> function is doing something like this:

{% highlight c++%}
vector<vector<int>> partition-all<T>(int partition_size,
                                     T begin, T end)
{
    vector<vector<int>> partitions;
    vector<int> current_partition;
    int current_partition_size = 0;
    for (auto i = begin; i != end; ++i)
    {
        if (current_partition_size < partition_size)
            current_partition.push_back(*i);
        else
        {
            partitions.push_back(current_partition);
            current_partition.clear();
        }
    }

    return partitions;
}
{% endhighlight %}

When the code is expressed this way, I can clearly see that we will use a signifigant amount of memory to store each of the consecutive integers. Actually, we only need to start the start and end index of each range. Here is a better implementation in C++:

{% highlight c++%}
vector<pair<int, int>> partition-all<T>(int partition_size,
                                        T begin, T end)
{
    vector<pair<int, int>> partitions_indices;
    int current_partition_size = 0;
    int current_start_index = 0;
    int current_end_index = 0;
    for (auto i = begin; i != end; ++i)
    {
        if (current_partition_size < partition_size)
            ++current_end_index;
        else
        {
            partitions_indices.push_back(
                    make_pair(current_start_index,
                              current_end_index));
            current_start_index = current_end_index + 1;
            ++current_end_index;
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
