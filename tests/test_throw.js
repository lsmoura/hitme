'use strict';

var hitme = require('../lib');

var caller = hitme(function(err, data) { if (err) { console.log('ERROR'); console.log(err); console.log('-'); return; } console.log(data + ' World'); });
caller(function(cb) { cb(null, 'Hello'); });
caller(function(cb) { throw(new Error('alarm!')); });
