---
layout: post
title: Unit Testing Locking
---
I've often found it difficult to unit test code which must lock a mutex. Suppose that I need to write an internally-locked queue. How can I write a failing test for code like this:

{% highlight c++ %}
template <typename T>
class queue {
  void enqueue(T value) {
    // We should lock mutex_ here.
    q_.push_back(value);
  }
private:
  std::deque<T> q_;
  pthread_mutex_t mutex_;
};
{% endhighlight %}

Locking in the correct place is rather important, since doing so incorrectly can lead to deadlocks on one hand or race conditions on the other. Something so important should be easy to test.

## Using a wrapper
It is possible to make this code testable by wrapping the threading API in a helper class. Then the helper class can be used in the unit tests to validate the locking behavior.

{% highlight c++ %}
class pthread_locker {
public:
  virtual void lock(pthread_mutex_t* m) {
    pthread_mutex_lock(m);
  }
};

template <typename T>
class queue {
  queue(pthread_locker* locker) :
    locker_(locker) {}

  void enqueue(T value) {
    locker->lock(&mutex_)
    q_.push_back(value);
  }
private:
  pthread_locker* locker_;
  std::deque<T> q_;
  pthread_mutex_t mutex_;
};
{% endhighlight %}

So we can write a test that looks like this:

{% highlight c++ %}
class mock_locker : pthread_mutex_locker{
public:
  mock_locker() : was_locked_(false) {}

  void lock(pthread_mutex_t* m) {
    was_locked_ = true;
  }

  bool was_locked() const {
    return was_locked_;
  }
private:
  bool was_locked_;
};

int main() {
    mock_locker lock_tracker;
    queue<int> subject(&lock_tracker);
    subject.enqueue(42);
    assert(lock_tracker.was_locked());

    return 0;
}
{% endhighlight %}

Although this works, I don't think it is desirable for two reasons:

1. It exposes something about the locking scheme on the API of the `queue` class, which seems unrelated to the behavior of the class.
2. It adds the overhead of a virtual function call each time a mutex is locked. This overhead can be significant if the mutex is locked often.

## Cleaning up the API
The C++11 threading library provides some useful tools to clean up this API, eliminate unnecessary overhead, and allow the code to be testable. Scope-based locking in C++11 can be implemented with the `std::lock_guard<T>` class, where T is the type of the mutex to lock. In most cases, production code can use the type `std::mutex` for T. But if we use something like [policy-based design](http://en.wikipedia.org/wiki/Policy-based_design), we can expose the mutex type as an optional template parameter.
 
{% highlight c++ %}
template<typename T, typename MutexType = std::mutex>
class queue
{
public:
  void enqueue(T value) {
      std::lock_guard<MutexType> guard(mutex_);
      q_.push_back(value);
  }
private:
  std::deque<T> q_;
  MutexType mutex_;
};
{% endhighlight %}

Now the API for our queue is an minimal as possible, but we can still inject a mock mutex type in order to verify that the `enqeue` method correctly takes the lock.

{% highlight c++ %}
class mock_mutex {
public:
  void lock() {
      lock_called_ = true;
  }

  void unlock() {}

  bool was_locked() {
      return lock_called_;
  }
private:
  static bool lock_called_;
};

bool mock_mutex::lock_called_ = false;

int main() {
  mock_mutex mutex_tracker;
  queue<int, mock_mutex> subject;
  subject.enqueue(42);
  assert(mutex_tracker.was_locked());

  return 0;
}
{% endhighlight %}

Once we have this unit testing scheme in place, it is possible to verify that the lock is correctly released. We can also test other methods of the `queue` class, like `try_dequeue` and `empty` without too much difficulty. Thanks to the template-based implementation of `std::lock_guard` in C++11, unit testing code that requires a lock is now possible, and dare I say, surprisingly easy.

You can find an example of the final code the compiles with Visual Studio 2013 [here](https://gist.github.com/joshpeterson/11285436).
