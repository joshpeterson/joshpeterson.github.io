---
layout: post
title: Unit Testing Locking
---
I've often found it difficult to unit test code which must lock a mutex. How can I write a failing test for code like this:

{% highlight c++ %}
pthread_mutex_t* mutex;

void write_to_std_out() {
  // We should lock mutex here.
  cout << "Four score and...";
}
{% endhighlight %}

Locking in the correct place is rather important, since doing so incorrectly can lead to deadlocks on one hand or race conditions on the other. Something so important should be easy to test.

##Using a wrapper##
It is possible to make this code testable by wrapping the threading API in a helper class. Then the help class can be used in the unit tests to validate the locking behavior.

{% highlight c++ %}
pthread_mutex_t* mutex;

class pthread_locker {
public:
  virtual void lock(pthread_mutex_t* m) {
    pthread_mutex_lock(m);
  }

  virtual void unlock(pthread_mutex_t* m) {
    pthread_mutex_unlock(m);
  }
};

void write_to_std_out(pthread_locker* locker) {
  // We should lock mutex here.
  locker->lock(mutex)
  cout << "Four score and...";
  locker->unlock(mutex)
}
{% endhighlight %}

So we can write a test that like this:

{% highlight c++ %}
class mock_locker : pthread_mutex_locker{
public:
  void lock(pthread_mutex_t* m) {
    was_locked_ = true;
  }

  void unlock(pthread_mutex_t* m) {
  }

  bool was_locked() const {
    return was_locked_;
  }
private:
  static bool was_locked_;
};

mock_locker::was_locked_ = true;

void write_to_std_out(pthread_locker* locker) {
  locker->lock(mutex)
  cout << "Four score and...";
  locker->unlock(mutex)
}
{% endhighlight %}
