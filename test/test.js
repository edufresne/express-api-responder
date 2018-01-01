/**
 * Created by ericdufresne on 2018-01-01.
 */
process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('./server/bin/www');
var app = require('./server/app');
var should = chai.should();

chai.use(chaiHttp);

describe('Middleware Tests', function () {

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
});