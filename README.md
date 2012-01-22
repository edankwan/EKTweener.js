Description
-----------
EKTweener.js is a simple transition library using the style like Tweener and TweenMax on Flash platform.

Basic Usage
-----------
```js
	
	var container = document.getElementById("container");
	
	// move the container from its current top to the 100px in 3 seconds.
	EKTweener.to(container, 3, {top: 100});
	
	// move the container from 200px top to the 100px in 3 seconds.
	EKTweener.fromTo(container, 3, {top: 200}, {top: 100});
	
```