/**
 * Created by ericdufresne on 2018-01-01.
 */
var codes = require('./codes');
exports.noContent = function () {
  return function () {
    this.status(204).end();
  };
};

exports.success = function (opts) {
  return function (body, code) {
    code = parseInt(code) || 200;
    if (!codes.isOk(code)){
      throw new Error('HTTP code must be a successful HTTP code');
    }
    body = body || {message: codes.description(code)};
    if (opts.includeCode){
      body[opts.includeCode] = code;
    }
    if (opts.includeSuccess){
      body[opts.includeSuccess] = true;
    }
    this.status(code).json(body);
  };
};

exports.error = function (opts) {
  return function (message, code) {
    code = parseInt(code) || 400;
    if (codes.isOk(code)){
      throw new Error('HTTP code must be a HTTP error code');
    }

    var body = {};
    if (opts.includeCode){
      body[opts.includeCode] = code;
    }
    if (opts.includeSuccess){
      body[opts.includeSuccess] = false;
    }
    body.message = message || codes.description(code);
    this.status(code).json(body);
  }
};

exports.paginate = function (opts) {
  return function (list, total, page, limit, code) {
    limit = parseInt(limit);
    total = parseInt(total);
    page = parseInt(page);

    if (limit <= 0){
      throw new Error('limit must be positive');
    }
    if (total < 0){
      throw new Error('total cannot be negative');
    }
    if (page < 0){
      throw new Error('page cannot be negative');
    }
    if (!(list instanceof Array)){
      throw new Error('list must be of type array');
    }

    code = parseInt(code) || 200;
    if (!codes.isOk(code)){
      throw new Error('HTTP code must be a successful HTTP code');
    }
    var body = {};
    if (opts.includeCode){
      body[opts.includeCode] = code;
    }
    if (opts.includeSuccess){
      body[opts.includeSuccess] = true;
    }
    body.list = list;
    body.total = total;
    body.page = page;
    body.limit = limit;
    body.pages = Math.ceil(total/limit);
    this.status(code).json(body);
  }
};

exports.catch = function (opts) {
  return function (err, code) {
    code = parseInt(code) || 500;
    if (!codes.isServerError(code)){
      throw new Error('Error code must be a HTTP server error code');
    }
    var body = {};
    if (opts.includeCode){
      body[opts.includeCode] = code;
    }
    if(opts.includeSuccess){
      body[opts.includeSuccess] = false;
    }
    if (process.env.NODE_ENV !== 'production'){
      body.message = err.message || codes.description(code);
      this.status(code).json(body);
    }
    else{
      body.message = codes.description(code);
      this.status(code).json(body);
    }

  }
};