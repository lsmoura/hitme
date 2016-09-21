# Hitme

Easily handle multiple blocks of functions that should be run independent from eachother and calls a callback when everything is done.

## Example

```javascript
var caller = hitme(function() { console.log('all done'); });

caller(function(cb) { console.log('a'); cb(null, 'a'); });
caller(function(cb) { console.log('b'); cb(null, 'b'); });
```

Expected result:
```
a
b
all done
```

## Usage

When calling `hitme()`, it will return a caller function for all your function blocks that should be run. `hitme` can take two arguments:

* callback - a function to call when everything is done
* thisArg - an optional argument to pass to the callback function as `this` value

The function returned by `hitme()`, takes only one parameter, a function. It will call this function as soon as the current block finishes execution (using `setImmediate`) and it should have one argument: a callback. This callback should be treated as a function with two parameters:

* error - if something is wrong and an erorr is passed, it will call the callback passed to `hitme()` with the error and any given data already passed by the other functions
* data - a value that will be passed as an additional parameter to the callback function sent to `hitme()`.

# License

MIT