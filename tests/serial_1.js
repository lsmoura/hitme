'use strict';

var hitme = require('../lib');

var test = function(serial, callback) {
    var caller;
    if (serial)
        caller = hitme.serial(callback);
    else
        caller = hitme(callback);

    caller(function(cb) {
        console.log('a');
        setImmediate(function() {
            console.log('a-immediate');
            cb(null, 'a-data');
        });
    });
    caller(function(cb) {
        console.log('b');
        setImmediate(function() {
            console.log('b-immediate');
            cb(null, 'b-data');
        });
    });
};

/* Expected first result output:
a
b
a-immediate
b-immediate
*/
var caller = hitme.serial();
caller(function(cb) {
    test(false, function() { console.log('-done not serial-'); cb(); });
});

/* Expected second (serial) result output:
a
a-immediate
b
b-immediate
*/
caller(function(cb) {
    test(true, function(err, data) { console.log('-done serial-'); cb(); });
});
