'use strict';

var level = require('level')
  , cache = level('./cache', {
    valueEncoding: 'json'
  });
  ;


// put item in cache
exports.put = function (key, value, done) {
  cache.put(key, value, done);
};

// get item from cache
exports.get = function (key, done) {
  cache.get(key, done)
};
