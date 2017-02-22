var Simulado = require('../lib/embedded-api');
var chai = require('chai').should();
var expect = require('chai').expect
var superagent = require('superagent');

describe('Simulado totalRequests', function() {

  beforeEach(function(done) {
    superagent.del('http://localhost:7000/clearLastRequests').end(done);
  });


  describe('One GET endpoint is mocked', function() {
    it('should return the total number of requests for an endpoint', function(done) {
      Simulado.mock({ path: "/myPath" }, function() {
        superagent.get('http://localhost:7000/myPath').end(function(_, res) {
          superagent.get('http://localhost:7000/totalRequests')
          .set('method', 'GET')
          .set('path', '/myPath')
          .end(function(_, res) {
            done();

            res.body.should.deep.equal({ total: 1 });
          });
        });
      });
    });
  });

  describe('Multiple GET endpoints are requested', function() {
    it('should return the total number of requests for any endpoint', function(done) {
      Simulado.mock({ path: "/myPath1" }, function() {
        Simulado.mock({ path: "/myPath2" }, function() {
          superagent.get('http://localhost:7000/myPath1').end(function(_, res) {
            superagent.get('http://localhost:7000/myPath2').end(function(_, res) {
              superagent.get('http://localhost:7000/totalRequests')
              .set('method', 'GET')
              .set('path', '/myPath2')
              .end(function(_, res) {
                done();
                res.body.should.deep.equal({ total: 1 });
              });
            });
          });
        });
      });
    });
  });

  describe('GET endpoint with wildcard', function() {
    it('should return the total number of requests for any endpoint', function(done) {
      Simulado.mock({ path: "/path/*" }, function() {
        superagent.get('http://localhost:7000/path/1').end(function(_, res) {
          superagent.get('http://localhost:7000/path/2').end(function(_, res) {
            superagent.get('http://localhost:7000/totalRequests')
            .set('method', 'GET')
            .set('path', '/path/*')
            .end(function(_, res) {
              done()
              res.body.should.deep.equal({ total: 2 });
            });
          });
        });
      });
    });
  });

  it("should reset the total number of requests", function(done) {
    Simulado.mock({ path: "/pathToReset" }, function() {
      superagent.get('http://localhost:7000/pathToReset').end(function(_, res) {
        superagent.del('http://localhost:7000/clearLastRequests').end(function(_, res) {
          superagent.get('http://localhost:7000/totalRequests')
          .set('method', 'GET')
          .set('path', '/pathToReset')
          .end(function(_, res) {
            done()
            res.body.should.deep.equal({ total: 0 });
          });
        });
      });
    });
  });
});

