/**
 * Created by ericdufresne on 2018-01-01.
 */
process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('./server/bin/www');
var app = require('./server/app');
var should = chai.should();
var codes = require('../lib/codes');

chai.use(chaiHttp);

describe('Middleware Tests', function () {

  after(function (argument) {
    process.exit(0);
  });
  describe('No Content', function () {
    it('Test No Content', function (done) {
      chai.request(app).get('/test-no-content').end(function (err, res) {
        res.should.have.status(204);
        done();
      });
    });
  });

  describe('Success', function () {
    it('Test success with no code', function (done) {
      chai.request(app).get('/test-success').end(function (err, res) {
        res.should.have.status(200);
        res.body.should.have.property('item1').eq('Test');
        res.body.should.have.property('item2').eq(false);
        done();
      });
    });

    it('Test success with code', function (done) {
      chai.request(app).get('/test-success').query({code: 201}).end(function (err, res) {
        res.should.have.status(201);
        res.body.should.have.property('item1').eq('Test');
        res.body.should.have.property('item2').eq(false);
        done();
      });
    });

    it('Test success with opts', function (done) {
      chai.request(app).get('/opts/test-success').end(function (err, res) {
        res.should.have.status(200);
        res.body.should.have.property('item1').eq('Test');
        res.body.should.have.property('item2').eq(false);
        res.body.should.have.property('status').eq(200);
        res.body.should.have.property('success').eq(true);
        done();
      });
    });

  });

  describe('Error', function () {
    it('Test error without code', function (done) {
      chai.request(app).get('/test-error').end(function (err, res) {
        res.should.have.status(400);
        res.body.should.have.property('message').eq('Bad Request');
        done();
      });
    });

    it('Test error with code', function (done) {
      chai.request(app).get('/test-error').query({code: 403}).end(function (err, res) {
        res.should.have.status(403);
        res.body.should.have.property('message').eq('Forbidden');
        done();
      })
    });
    it('Test error with opts', function (done) {
      chai.request(app).get('/opts/test-error').query({code: 404}).end(function (err, res) {
        res.should.have.status(404);
        res.body.should.have.property('message').eq('Not Found');
        res.body.should.have.property('success').eq(false);
        res.body.should.have.property('status').eq(404);
        done();
      });
    });
    it('Test error with message', function (done) {
      chai.request(app).get('/test-error').query({code: 409, message: 'Test'}).end(function (err, res) {
        res.should.have.status(409);
        res.body.should.have.property('message').eq('Test');
        done();
      })
    });
  });

  describe('Pagination', function () {
    it('Test pagination without code', function (done) {
      chai.request(app).get('/test-page').query({total: 5, page: 1, limit: 4}).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.have.property('list');
        res.body.list.should.have.lengthOf(3);
        res.body.should.have.property('limit').eq(4);
        res.body.should.have.property('page').eq(1);
        res.body.should.have.property('total').eq(5);
        res.body.should.have.property('pages').eq(2);
        done();
      })
    });

    it('Test pagination with code', function (done) {
      chai.request(app).get('/test-page').query({total: 5, page: 1, limit: 4, code: 201}).end(function (err, res) {
        res.should.have.status(201);
        done();
      });
    });

    it('Test pagination with opts', function (done) {
      chai.request(app).get('/opts/test-page').query({total: 5, page: 1, limit: 4}).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.have.property('status').eq(200);
        res.body.should.have.property('success').eq(true);
        done();
      });
    });
  });

  describe('Catch', function () {
    it('Test catch without code. Env test', function (done) {
      chai.request(app).get('/test-catch').end(function (err, res) {
        res.should.have.status(500);
        res.body.should.have.property('message').eq('A really bad error of information the user should not know');
        done();
      })
    });

    it('Test catch with code. Env production', function (done) {
      chai.request(app).get('/test-catch').query({env: 'production', code: 502}).end(function (err, res) {
        res.should.have.status(502);
        res.body.should.have.property('message').eq('Bad Gateway');
        done();
      });
    });

    it('Test catch with opts', function (done) {
      chai.request(app).get('/opts/test-catch').end(function (err, res) {
        res.should.have.status(500);
        res.body.should.have.property('status').eq(500);
        res.body.should.have.property('message').eq('A really bad error of information the user should not know');
        res.body.should.have.property('success').eq(false);
        done();
      })
    })
  });

  describe('Default Responses', function () {
    it('Testing success responses', function () {
      codes.description(200).should.eq('Success');
      codes.description(201).should.eq('Created');
      codes.description(202).should.eq('Accepted');
      codes.description(203).should.eq('Non-Authoritative Information');
      codes.description(204).should.eq('No Content');
      codes.description(205).should.eq('Reset Content');
      codes.description(206).should.eq('Partial Content');
      codes.description(207).should.eq('Multi-Status');
      codes.description(208).should.eq('Already Reported');
      codes.description(226).should.eq('IM Used');
    });

    it('Testing redirect responses', function () {
      codes.description(300).should.eq('Multiple Choices');
      codes.description(301).should.eq('Moved Permanently');
      codes.description(302).should.eq('Found');
      codes.description(303).should.eq('See Other');
      codes.description(304).should.eq('Not Modified');
      codes.description(305).should.eq('Use Proxy');
      codes.description(306).should.eq('Switch Proxy');
      codes.description(307).should.eq('Temporary Redirect');
      codes.description(308).should.eq('Permanent Redirect');
    });

    it('Testing error responses', function () {
      codes.description(400).should.eq('Bad Request');
      codes.description(401).should.eq('Unauthorized');
      codes.description(402).should.eq('Payment Required');
      codes.description(403).should.eq('Forbidden');
      codes.description(404).should.eq('Not Found');
      codes.description(405).should.eq('Method Not Allowed');
      codes.description(406).should.eq('Not Acceptable');
      codes.description(407).should.eq('Proxy Authentication Required');
      codes.description(408).should.eq('Request Timeout');
      codes.description(409).should.eq('Conflict');
      codes.description(410).should.eq('Gone');
      codes.description(411).should.eq('Length Required');
      codes.description(412).should.eq('Precondition Failed');
      codes.description(413).should.eq('Payload Too Large');
      codes.description(414).should.eq('URI Too Long');
      codes.description(415).should.eq('Unsupported Media Type');
      codes.description(416).should.eq('Range Not Satisfiable');
      codes.description(417).should.eq('Expectation Failed');
      codes.description(418).should.eq("I'm a teapot ;)");
      codes.description(421).should.eq('Misdirected Request');
      codes.description(422).should.eq('Unprocessable Entity');
      codes.description(423).should.eq('Locked');
      codes.description(424).should.eq('Failed Dependency');
      codes.description(426).should.eq('Upgrade Required');
      codes.description(428).should.eq('Precondition Required');
      codes.description(429).should.eq('Too Many Requests');
      codes.description(431).should.eq('Request Header Fields Too Large');
      codes.description(451).should.eq('Unavailable For Legal Reasons');
    });

    it('Testing server error responses', function () {
      codes.description(500).should.eq('Internal Server Error');
      codes.description(501).should.eq('Not Implemented');
      codes.description(502).should.eq('Bad Gateway');
      codes.description(503).should.eq('Service Unavailable');
      codes.description(504).should.eq('Gateway Timeout');
      codes.description(505).should.eq('HTTP Version Not Supported');
      codes.description(506).should.eq('Variant Also Negotiates');
      codes.description(507).should.eq('Insufficient Storage');
      codes.description(508).should.eq('Loop Detected');
      codes.description(510).should.eq('Not Extended');
      codes.description(511).should.eq('Network Authentication Required');
    });
  });

  describe('Signing Repsonses', function () {
    it('Test signing without code', function (done) {
      chai.request(app).get('/test-sign').end(function (err, res) {
        res.should.have.status(200);
        res.body.should.have.property('token');
        res.body.should.have.property('data');
        var data = res.body.data;
        data.should.have.property('id').eq(1);
        data.should.have.property('field').eq('Test');
        done();
      });
    });

    it('Test signing with code', function (done) {
      chai.request(app).get('/test-sign').query({code: 201}).end(function (err, res) {
        res.should.have.status(201);
        res.body.should.have.property('token');
        res.body.should.have.property('data');
        var data = res.body.data;
        data.should.have.property('id').eq(1);
        data.should.have.property('field').eq('Test');
        done();
      });
    });

    it('Test signing with opts', function (done) {
      chai.request(app).get('/opts/test-sign').end(function (err, res) {
        res.should.have.status(200);
        res.body.should.have.property('status').eq(200);
        res.body.should.have.property('success').eq(true);
        res.body.should.have.property('secretToken');
        res.body.should.have.property('user');
        var data = res.body.user;
        data.should.have.property('id').eq(1);
        data.should.have.property('field').eq('Test');
        done();
      });
    });

  });
});