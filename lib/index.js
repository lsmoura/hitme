'use strict';

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

        setImmediate(entry, done);
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

        if (data !== undefined & Array.isArray(ret.data))
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
