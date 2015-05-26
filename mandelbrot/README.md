# Mandelbrot Set

## Usage
SVG version is borked. Use canvas:
```javascript
canvasMandelbrot(0, 0, 1, {scale: 30, width: 300, height: 300, translateX: 100, translateY: 100});
```

## Options
### left
### top
### width
### translateX
number of pixels to horizontally translate drawn image
### translateY
number of pixels to vertically translate drawn image
### scale
scales `width`
### countMax
number of iterations of inner-most loop (which calculates generations for a given x,y coord)


## Possible Exercises
* Refactor the duplicated code that assigns defaults in `svgMandelbrot` and `canvasMandelbrot`. Try using a polyfill for [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#polyfill).
* Rewrite the algorithm using an OO approach. Profile your new OO code against the original implementation.
* Why does the SVG rendition suck so much? Is there anything we can do? What if we iterated by steps of size 2 from 1 to 150?
* How can we dynamically calculate a translation of the figure so it is in the center of the page?

## Errata
The algorithm (as provided in new turing omnibus) refers to the variables `x` and `y`. By this is meant `zx` and `zy`.


## Object.assign
if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target, firstSource) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}