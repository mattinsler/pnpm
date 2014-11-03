'use strict';

exports.setup = function (app) {

  // get info about a current user
  app.get('/-/user/org.couchdb.user::user', function (req, res) {
    res.status(200).end();
  });

  // add a new user
  app.put('/-/user/org.couchdb.user::user', function (req, res) {
    res.status(201).end();
  });

};
