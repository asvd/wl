wl - Whenable events
====================

There are two kinds of events:

- *Reusable* events which may happen many times, like a mouse click or
  a keypress. When subscribing to such an event, one normally does not
  care if an event has already been triggered in the past. One just
  needs to perform an action when the event is fired in the future.

- *One-off* events which only happen once, for instance a page load
  event, a json-request responce, a complete of calculation delegated
  to a worker, or an asynchronous function callback.

Whenable is a design pattern targeted to simplify the work with the
second kind of events. For those it matters when exactly an event
happens: if there is no assurance about if the event has already been
triggered, there is a need for additional check and a separate
branch. This happens, for instance, if we need to perform something
upon the page load: first we perform a check if the document is ready
(in this case we will likely prefer to perform the actions
immediately), otherwise we store the listener as `window.onload`.

Whenable simplifies dealing with the one-off events by providing an
opportunity to create a special kind of a listener subscriber.  When
using that subscriber, one does not need to worry about if the event
has already been triggered (in this case the listener is invoked
immediately). Additionally, the subscriber can be provided with
several listeners independently.

Compare subscribing to the page onload event in the traditional
style...


```js
if (document.readyState !== "complete") {
    // already loaded
    doWhatWeNeed();
} else {
    // preserving existing listener
    var origOnload = window.onload || function(){};

    window.onload = function(){
        origOnload();
        doWhatWeNeed();
    }
}
```

...and using the 'whenable' subscriber, which simplifies everything
above to:


```js
window.whenLoaded(doWhatWeNeed());
```

*The code means: call the given function if the page is loaded,
otherwise wait until it is loaded and then call the function.*


The listener subscribers which behave like this are conventionally
named starting with the `when..` prefix and followed by a past
participle describing an event: `whenLoaded`, `whenCompleted`,
`whenFailedToLoad`, and so on. Similarry the `Whenable` term is also
conventionnaly used to describe an event which provides this kind of
subscriber.

Whenable pattern was inspired by Promises, and it is similar to
Promises in that it also allows not to care about when an event
actually fires. But unlike Promises, Whenable is much easier to use
and understand, produces simplier code, and is more general solution
thus covering a wider range of use-cases.

The `wl` library implements the Whenable object.


### Installation

For the web-browser environment — download the
[distribution](https://github.com/asvd/wl/releases/download/v0.1.0/wl-0.1.0.tar.gz),
unpack it and load the `wl.js` in a preferrable way. That is an
UMD module, thus for instance it may simply be loaded as a plain
JavaScript file using the `<script>` tag:

```html
<script src="wl/wl.js"></script>
```

For Node.js — install wl with npm:

```sh
$ npm install wl
```

and then in your code:

```js
var wl = require('wl');
```

Optionally you may load the script from the
[distribution](https://github.com/asvd/wl/releases/download/v0.1.0/wl-0.1.0.tar.gz):

```js
var wl = require('path/to/wl.js');
```

After the module is loaded, the `wl.Whenable()` constructor is
available.



### Usage

Creating the Whenable event is simple. First create an object instance
representing an event:

```js
var myWhenable = new wl.Whenable;
```

The object has the two methods:

```js
myWhenable.emit();
```

- to fire the event and call all the subscribed listeners, and:


```js
myWhenable.whenEmitted(myListener);
```

- to subscribe `myListener()` function to the event. It will be
invoked after the event is triggered. If the event has already been
triggered before, the listener is called immediately (yet
asynchronously to keep the flow consistent).

The methods of the `Whenable` object (along with the `Whenable`
instance itself) are not supposed to be exposed to the event
user. Instead a whenable subscriber should be created, which is simply
a wrapper for the `whenEmitted()` method:


```js
// subscribes a listener to the event
var whenSomethingHappened = function(listener) {
    myWhenable.whenEmitted(listener);
}
```

The `emit()` method is invoked by an internal logic related to the
event. Now anyone may use `whenSomethingHappened()` subscriber and
listen to the event.

When providing a listener, the context may be provided as a second
argument:

```js
myWhenable.whenEmitted(myObject.someMethod, myObject);
```

Upon the event trigger, the listener is executed in the given context.

Additionally, the emission method may take any set of arguments which
are then forwarded to every listener. This allows to provide the listeners with the event details upon emission:

```js
myWhenable.emit(result);
```



### Examples


Here is an ordinary asynchronous function which executes a callback
after some time:

```js
var doSomething = function(cb) {
    setTimeout(cb, 1000);
}
```

Let us create a Whenable event representing a function complete:


```js
var somethingWhenable = new Whenable();

var whenSomethingDone = function(cb) {
    somethingWhenable.whenEmitted(cb);
}

var initiateSomething = function() {
    doSomething(function() {
        somethingWhenable.emit();
    });
}
```

Now we have the two functions:

- `initiateSomething()` starts the process which finally leads to the
  event emission, and

- `whenSomethingDone()`, the whenable-style subscriber which may
  subscribe as many listeners as needed, before or after the event
  emission.

Those two functions may now be used independently.


Here is the implementation of the magic `window.whenLoaded()`
subscriber used to listen the page load event, given in the beginning
of this text:

```js
var createWhenLoaded = function() {
    var onloadWhenable = new Whenable;

    if (document.readyState !== "complete") {
        // already loaded
        onloadWhenable.emit();
    } else {
        // preserving existing listener
        var origOnload = window.onload || function(){};

        window.onload = function(){
            origOnload();
            onloadWhenable.emit();
        }
    }

    return function(listener) {
        onloadWhenable.whenEmitted(listener);
    }
}


window.whenLoaded = createWhenLoaded();
```

