'use strict';

var crypto = require('crypto');

// calculate revision number, similar to couchdb. if the input causes an
// error, simply output default revision starting with 1-random
exports.calculateRevision = function (rev) {

  var random = crypto.pseudoRandomBytes(16).toString('hex');

  try {
    // match couchdb format
    var inc = Number(rev.match(/^([0-9]+)-[0-9a-fA-F]{32}$/)[1]) + 1;
    return inc + '-' + random;
  } catch (e) {
    // doesn't matter what error, always return this
    return '1-' + random;
  }

};
