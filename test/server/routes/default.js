/**
 * Created by ericdufresne on 2018-01-01.
 */
var express = require('express');
var router = express.Router();
var responder = require('../../../index');
router.use(responder());

router.get('/test-no-content', function (req, res) {
  res.noContent();
});
router.get('/test-success', function (req, res) {
  res.success({
    item1: 'Test',
    item2: false
  }, req.query.code);
});
router.get('/test-error', function (req, res) {
  res.error(req.query.message, req.query.code);
});
router.get('/test-catch', function (req, res) {
  process.env.NODE_ENV = req.query.env || 'test';
  res.catch({message: 'A really bad error of information the user should not know'}, req.query.code);
  process.env.NODE_ENV = 'test';
});
router.get('/test-page', function (req, res) {
  res.paginate([1, 2, 3], req.query.total, req.query.page, req.query.limit, req.query.code);
});

module.exports = router;