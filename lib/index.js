'use strict';

/**
 * Catch errors thrown in 'entryfunc' and pass them as parameters to 'callback'
 * @param entryfunc function to call and listen to throw errors
 * @param callback function to pass as callback to 'entryfunc' and to send errors to.
 */
var safeCall = function(entryfunc, callback) {
    try {
        entryfunc(callback);
    }
    catch (e) {
        callback(e);
    }
};

module.exports = function(callback, thisArg) {
    // Flag to be sure we'll only call the callback function once.
    var called = false;

    // Number of function executions remaining before calling the given callback.
    var count = 0;

    // Function given to the user so it can start to give functions to call.
    var ret = function(entry) {
        count++;
        var handled = false;
        var done = function() {
            if (handled) return; // Maybe throw an error here?
            handled = true;
            finish.apply(null, Array.prototype.slice.call(arguments, 0));
        };

        setImmediate(safeCall, entry, done);
    };

    // parameter passed to the callback as 'this'
    ret.thisArg = thisArg;
    /*
      holds all data retrieved from callbacks. If this is changed to
      a non-array object, we won't touch it and will pass it as-is.
    */
    ret.data = [];

    /*
      This function is passed to every function as the first parameter. 
      it should be called once every time the given function
      block finishes executing and, after all blocks are done, the callback
      parameter will be called.
    */
    var finish = function(err, data) {
        count--;
        /*
          We'll only call the callback once. This shouldn't happen as the
          user can't call this function more than once function block, but
          better be safe than sorry.
        */
        if (called) return;

        if (data !== undefined && Array.isArray(ret.data))
            ret.data.push(data);
        if (err || count <= 0) {
            if (!callback) return;
            var payload = [ err ];

            if (Array.isArray(ret.data)) {
                if (ret.data.length > 0)
                    payload = payload.concat(ret.data);
            }
            else if (ret.data != null)
                payload.push(ret.data);


            setImmediate(function() {
                callback.apply(ret.thisArg, payload);
            });
        }
    };

    return(ret);
};


/**
 * This implements the same behavior as the original hitme(), except the next function
 * will only be called once the previous one has called its given callback.
 */
module.exports.serial = function(callback, thisArg) {
    // Flag to be sure we'll only call the callback function once.
    var called = false;

    // Have we started calling functions yet?
    var started = false;

    // Functions on stack
    var stack = [];

    // This is the function returned to the user. It adds functions to the stack.
    var ret = function(entry) {
        if (!started) {
            started = true;
            callNext(entry);
        }
        else {
            stack.push(entry);
        }
    };

    // This calls the entry function. It should be the next function on stack.
    var callNext = function(entry) {
        var handled = false;
        var done = function() {
            if (handled) return;
            handled = true;
            finish.apply(null, Array.prototype.slice.call(arguments, 0));
        };

        setImmediate(safeCall, entry, done);
    };

    // parameter passed to the callback as 'this'
    ret.thisArg = thisArg;
    /*
      holds all data retrieved from callbacks. If this is changed to
      a non-array object, we won't touch it and will pass it as-is.
    */
    ret.data = [];

    /*
      This function is passed to every function as the first parameter.
      it should be called once every time the given function
      block finishes executing and, after all blocks are done, the callback
      parameter will be called.
    */
    var finish = function(err, data) {
        if (called) return;

        var next = stack.shift();

        if (data !== undefined && Array.isArray(ret.data))
            ret.data.push(data);

        // We'll finish execution if we get an error or if we have no other
        // functions on the stack.
        if (err || next === undefined) {
            if (!callback) return;
            var payload = [ err ];

            if (Array.isArray(ret.data)) {
                if (ret.data.length > 0)
                    payload = payload.concat(ret.data);
            }
            else if (ret.data != null)
                payload.push(ret.data);

            setImmediate(function() {
                callback.apply(ret.thisArg, payload);
            });
        }
        else {
            callNext(next);
        }
    };

    return(ret);
};
