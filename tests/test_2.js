'use strict';

var hitme = require('../lib');

(function(param) {
    var caller = hitme(function(err, data) {
        console.log('-data-');
        console.log(data);
    });
    caller.data = param;
    caller(function(cb) {
        console.log('aa');
        cb(null, 'aa-result');
    });
    caller(function(cb) {
        console.log('bb');
        cb(null, 'bb-result');
    });
    caller(function(cb) {
        console.log('cc');
        cb();
    });
})('ace of spades');
