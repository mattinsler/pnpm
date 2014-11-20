'use strict';

var level = require('level')
  , updates = require('../../npm/updates')
  , util = require('../util')
  , db = {}
  ;

db.packages = level('./db', {
  valueEncoding: 'json'
});


// find all objects match the search object search criteria
// and present a summary view
exports.all = function (done) {

  var stream = db.packages.createReadStream();

  var docs = {};

  stream.on('data', function (data) {
    
    var doc = data.value; // quick reference

    // delete excessive fields
    delete doc._id;
    delete doc.readme;
    delete doc._attachments;

    // replace all verions with the latest, and strip all metadata
    var latest = doc['dist-tags'].latest;
    doc.versions = {};
    doc.versions[latest] = 'latest';

    docs[data.key] = doc;
  });

  stream.on('error', function (err) {
    done(err);
  });
  
  stream.on('end', function () {
    done(null, docs);
  });
};

// find a single package, don't include attachments
exports.one = function (name, done) {
  db.packages.get(name, function (err, doc) {
    // database error
    if (err) {
      done(err);
    // not found
    } else if (!doc) {
      done({ error: 'package not found' });
    // found
    } else {
      delete doc._attachments;
      done(null, doc);
    }
  });
};

// retrieve tarball attachment, quick and dirty, not ideal
exports.tar = function (name, file, done) {
  db.packages.get(name, function (err, doc) {
    if (!doc || !doc._attachments[file]) {
      done({ error: 'tar not found' });
    } else {
      done(null, new Buffer(doc._attachments[file].data, 'base64'));
    }
  });
};

// store a package
exports.put = function (req, done) {

  db.packages.get(req.body._id, function (err, doc) {

    // delegate update to code from npm-registry-couchapp
    // its kinda large, thank you guys for all the hard work!
    var update = updates.package(doc, req);

    // catch conflicts
    if (update[0]._id === '.error.') {
      done(update[0]);

    } else {

      update[0]._rev = util.calculateRevision(update[0]._rev);

      db.packages.put(req.body._id, update[0], function () {
        done(null, update[1]);
      });
    }
    
  });

};
