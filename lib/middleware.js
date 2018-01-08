/**
 * Created by ericdufresne on 2018-01-01.
 */
var functions = require('./functions');

module.exports = function (opts) {
  opts = opts || {};
  opts.includeCode = opts.includeCode || false;
  opts.includeSuccess = opts.includeSuccess || false;
  if (opts.signing){
    if (!opts.signing.jwtSecret){
      throw new Error('Signing opts passed but missing "jwtSecret"');
    }
  }

  return function (req, res, done) {
    res.noContent = functions.noContent();
    res.error = functions.error(opts);
    res.success = functions.success(opts);
    res.paginate = functions.paginate(opts);
    res.catch = functions.catch(opts);
    if (opts.signing){
      opts.signing.tokenKey = opts.signing.tokenKey || 'token';
      opts.signing.bodyKey = opts.signing.bodyKey || 'data';
      res.sign = functions.sign(opts);
    }
    done();
  };
};