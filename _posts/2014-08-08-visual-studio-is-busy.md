---
layout: post
title: Visual Studio is busy
---
One of the preferences in the [Unity](http://unity3d.com) editor allows a user to choose which external editor should be used to open a script file. An often-up-voted [problem](http://issuetracker.unity3d.com/issues/double-clicking-a-c-number-script-will-open-monodevelop-instead-of-visual-studio) on the Unity Issue Tracker occurs when some version of Visual Studio is chosen as the external editor, but Unity opens a script file in Mono Develop instead. I recently had the opportunity to investigate this problem, and I learned some interesting information about how out-of-process calls can be made to Visual Studio.

## Communication via COM##
Unity communicates with Visual Studio via a COM interface named the [DTE](http://msdn.microsoft.com/en-us/library/envdte.dte.aspx) interface. All methods on a COM interface return a value of type [`HRESULT`](http://msdn.microsoft.com/en-us/library/bb446131.aspx), which is a 32-bit value where each bit has a different meaning. The Windows header files define various common `HRESULT` values, like `S_OK` to indicate a successful call to the given COM method. Calls to a COM method that fail can return any one of various error values. A COM interface also allows these calls to be made from one process to another. Unity uses this aspect of the DTE interface to communicate with Visual Studio.

The problematic error code returned by Visual Studio in this case  is `RPC_E_CALL_REJECTED`, which has a hexadecimal value of 0x80010001. The value `RPC_E_CALL_REJECTED` is a rather general error code which indicates that Visual Studio cannot handle the call for some reason. This often happens because Visual Studio is busy doing something else, and it cannot service the remoted call from the DTE interface in the calling process.

## Solving the problem##
In the issue at hand, it became clear that the behavior was intermittent. Some users reported always having the problem, others say it happens half of the time a script file was opened. Still other users never experienced it at all. Users in all three groups were describing the behavior correctly! After some investigation, we learned that this problem usually occurs in two specific cases:

1. A new instance of Visual Studio has been started by Unity.
2. An existing instance of Visual Studio is displaying a modal dialog.

### Case 1: A new instance###

The first of these two cases is likely the most common, and is one that has been experienced in multiple versions of Unity. After starting a new instance of Visual Studio, the code in Unity had a loop that looked something like this:

{% highlight c++ %}
while (timeMs < timeoutMs) {
  if (SUCCEEDED(dte->get_MainWindow()))
    break;
  Sleep(intervalMs);
  timeMs += intervalMs;
}
{% endhighlight %}

This loop will call the `get_MainWindow` method a number of times until it finds a successful call or until `timeoutMs` time is reached. In practice, `timeMs` is five seconds, and `intervalMs` is fifty milliseconds. This code only executes when a new instance of Visual Studio is started, and its intent it to wait until `RPC_E_REJECTED` return values stop happening, indicating that Visual Studio has completed its startup and it ready to accept other calls on the DTE interface. Sometimes this worked as expected.

Even with this code in place, the problem continued to occur for some users. After investigating a bit more, we found that the call to `get_MainWindow` can return `S_OK`, but that does not necessarily indicate that Visual Studio is ready for other DTE calls. During the startup of a new Visual Studio instance, calls to the DTE interface may be momentarily allowed, then later fail again with `RPC_E_CALL_REJECTED`. This is precisely what was happening. After getting a successful call to `get_MainWindow`, the code in Unity continued to call other DTE functions, like `get_ItemOperations` and then `OpenFile` on the `ItemOperations` object. We found that at any given time, these calls can also fail with `RPC_E_CALL_REJECTED`, even after `get_MainWindow` returned successfully!

When one of these calls failed, the code in Unity decided to fall back to a different external code editor, which is often Mono Develop. If the script could not be opened in Mono Develop, then Unity would fall back to the editor registered with Windows to handle the script file type (e.g. .cs). This is often a different version of Visual Studio than the one selected in the Unity preferences, or maybe even Notepad.

The newly started instance of Visual Studio, meanwhile, was often left in a very odd state. It's process could be running, but its window may not actually be shown, so there is no clear indication that it has been started. A subsequent attempt to open a script file via Unity might then find this running instance of Visual Studio and correctly use it to open the script, leading to a behavior where Unity works correctly half of the time and fails the other half.

The code above to wait in a `while` loop with a call to `Sleep` is not exactly pretty. I cringed the first time I saw it. I was soon re-using it though! We don't have nearly the tools for cross-process communication that we have for cross-thread communication. So I decided to solve this problem by using this same while loop in more places where the communication between Unity and Visual Studio is likely to fail immediately after Visual Studio is started. In practice, the loop seldom iterates more than one or two times, so Unity won't usually wait for 5 seconds. Although Visual Studio often does return `RPC_E_CALL_REJECTED` immediately after it starts, it will soon (a few milliseconds later) be ready to accept out-of-process calls on the DTE interface.

### Case 2: A modal dialog###
We also see Visual Studio return `RPC_E_CALL_REJECTED` when it is displaying certain modal dialogs. For example, if a Visual Studio project is modified by the user in Visual Studio and by the Unity editor (for example, when a new script is added in Unity), Visual Studio will display a dialog asking the user to either keep the changed project file or discard it in favor of the new one. Any calls made on the DTE interface while this dialog is displayed will fail with `RPC_E_CALL_REJECTED`. We have found that not all modal dialogs in Visual Studio behave this way, but some do.

Currently, Unity does not store any state information about which Visual Studio session was last used to display a script file from Unity. Instead, Unity inspects each running Visual Studio instance and asks it (via the DTE interface) which solution file it has open. If a session of Visual Studio is displaying a modal dialog like the one described above, Unity is unable to get a proper response from the DTE interface about which solution is open. Therefore, a request by the user of Unity to open a new script file in Visual Studio can fail if Visual Studio is busy displaying a dialog.

In this case, Unity will attempt to open a new instance of Visual Studio to display the script file. Clearly, Unity could improve its behavior in this case by keeping track of which Visual Studio instance was last used to display a given script file. However, storing that state brings along its own set of cross-process synchronization problems, since Unity must then track more information about which Visual Studio sessions are closed or crash (among other cases). Certainly, this is a direction that we might take in the future though.

## Conclusion##
Cross-process synchronization can be difficult, especially when the code for one of the process is outside your control. Any communication with Visual Studio on the DTE interface is subject to the possibility of a `RPC_E_CALL_REJECTED` error code, so we must write the client-side code defensively, allowing for the possibility of retrying a failed call.
