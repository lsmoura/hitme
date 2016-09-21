'use strict';

var hitme = require('../lib/index.js');

(function() {
    var caller = hitme(
        function(err, data) {
            console.log('-this-');
            console.log(this);
            console.log('-err-');
            console.log(err);
            console.log('-data-');
            console.log(data);
            console.log('-arguments-');
            console.log(arguments);
            console.log('-done-');
        },
        'thisArg'
    );

    caller(function(cb) {
        console.log('a');
        cb(null, 'a-result');
    });
    caller(function(cb) {
        console.log('b');
        cb(null, 'b-result');
    });
})();
    
