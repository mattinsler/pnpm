'use strict';

var config = require('../config')
  , db = require('./' + config('db').driver)
  ;

// find all objects match the search object search criteria
// and present a summary view
exports.all = function (done) {
  db.all(done);
};

// find a single package, don't include attachments
exports.one = function (name, done) {
  db.one(name, done);
};

// retrieve tarball attachment, quick and dirty, not ideal
exports.tar = function (name, file, done) {
  db.tar(name, file, done);
};

// store a package
exports.put = function (req, done) {
  db.put(req, done);
};
