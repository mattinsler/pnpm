'use strict';

var util   = require('../../util')
  , expect = require('chai').expect
  ;

describe('util', function () {

  describe('#calculateRevision()', function () {

    var match = /^([0-9]+)-[0-9a-fA-F]{32}$/;

    it('should create a new revision', function () {
      expect(util.calculateRevision()).match(match);
    });

    it('should increment key', function () {
      var rev = '0-00000000000000000000000000000000';
      var m = util.calculateRevision(rev);
      expect(m).to.match(match);
      var i = Number(m.match(match)[1]);
      expect(i).to.equal(1);
    });

  });

});
