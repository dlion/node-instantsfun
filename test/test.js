var assert  = require('assert'),
    instant = require('../lib/instantsfun');

describe('InstantsFun', function() {

  describe('#getAllList()', function() {
    it('should return an object', function(done) {
      this.timeout(15000);
      instant.getAllList(function(obj) {
        assert.throws(function() {
          throw new Error("Request Error");
        },Error);
        assert.notEqual(obj[0].title, "undefined");
        assert.notEqual(obj[0].song, "undefined");
        done();
      });
    });
  });
});
