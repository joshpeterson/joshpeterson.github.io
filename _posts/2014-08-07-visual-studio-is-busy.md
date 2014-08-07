---
layout: post
title: Visual Studio is busy
---
One of the preferences in the [Unity](http://unity3d.com) editor allows a user to choose which external editor should be used to open a script file. An often-up-voted [problem](http://issuetracker.unity3d.com/issues/double-clicking-a-c-number-script-will-open-monodevelop-instead-of-visual-studio) on the Unity Issue Tracker occurs when some version of Visual Studio is chosen as the external editor, but Unity opens a script file in Mono Develop instead. I recently had the opportunity to investigate this problem, and I learned some interesting information about how out of process calls can be made to Visual Studio.

##Communication via COM##
Unity communicates with Visual Studio via a COM interface named the [DTE](http://msdn.microsoft.com/en-us/library/envdte.dte.aspx) interface. All methods on a COM interface return a value of type [`HRESULT`](http://msdn.microsoft.com/en-us/library/bb446131.aspx), which is a 32-bit value where each bit has a different meaning. The Windows header files define various common `HRESULT` values, like `S_OK` to indicate a successful call to the given COM method. Calls to a COM method that fail can return any of various error values. A COM interface also allows these calls to be made from one process to another. Unity uses this aspect of the DTE interface to communicate with Visual Studio.

The problematic error code in this case returned by Visual Studio is ``RPC_E_CALL_REJECTED``, which has a hex value of 0x80010001. A return value of `RPC_E_CALL_REJECTED` is a rather general error code which indicates that Visual Studio cannot handle the call for some reason. This often happens because Visual Studio is busy doing something else, and it cannot service the remoted call from the DTE interface in the calling process.

##Solving the problem##
In the issue at hand, it became clear that the behavior was intermittent. Some users reported always having the problem, others say it happen half of the time a script file was opened. Still other users never experienced it at all. After some investigation, we learned that this problem usually occurs in two specific cases:

1. A new instance of Visual Studio has been started by Unity.
2. An existing instance of Visual Studio is displaying a modal dialog.

###Case 1: A new instance###

The first of these two cases is likely the most common, and is one that has been experienced in early versions of Unity as well. After starting a new instance of Visual Studio, the code in Unity had a loop that looked something like this:

{% highlight c++ %}
while (timeMs < timeoutMs) {
  if (SUCCEEDED(dte->get_MainWindow()))
    break;
  Sleep(intervalMs);
  timeMs += intervalMs;
}
{% endhighlight %}

This loop will call the `get_MainWindow` method a number of times until it finds a successful call or until `timeoutMs` time is reached. In practice, `timeMs` is five seconds, and `intervalMs` is fifty milliseconds. This code only executes when a new instance of Visual Studio is started, and its intent it to wait until RPC_E_REHECTED return values stop happening, indicating that Visual Studio has completed its startup and it ready to accept other calls on the DTE interface. Sometimes this worked as expected.

However, with this code, the problem continued to occur for some users. After investigating a bit more, we found that the call to `get_MainWindow` can return `S_OK`, but that does not necessarily indicate that Visual Studio is ready for other DTE calls. During the startup of a new Visual Studio instance, calls to the DTE interface may be momentarily allowed, then later fail again with `RPC_E_CALL_REJECTED`. This is precisely what was happening. After getting a successful call to `get_MainWindow`, the code in Unity continued to call other DTE functions, like `get_ItemOperations` and then `OpenFile` on the `ItemOperations` object. We found that at any given time, these calls can also fail with `RPC_E_CALL_REJECTED`, even after `get_MainWindow` returned successfully!

When one of these calls failed, the code in Unity decided to fall back to a different external code editor, which is often Mono Develop. If the scripting could not be opened in Mono Develop, then Unity would fall back to the editor registered with Windows to handle the script file type (e.g. *.cs). This is often a different version of Visual Studio than the one selected in the Unity preferences, or maybe even Notepad.

The newly started instance of Visual Studio, meanwhile, was often left in a very odd state. It process could be running, but its window is not actually shown, so there is no clear indication that it has been started. A subsequent attempt to open a script file via Unity might then find this running instance of Visual Studio and correctly use it to open the script, leading to a behavior where Unity works correctly half of the time and fails the other half.

