# express-api-responder
[![version](https://img.shields.io/npm/v/express-api-responder.svg)](https://www.npmjs.org/package/express-api-responder)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![Build Status](https://travis-ci.org/edufresne/express-responder.svg?branch=master)](https://travis-ci.org/edufresne/express-api-responder)

A small Express.js Middleware for conveniently formatting JSON responses. This package builds into the Express.js 
response object and allows you to return data in the following:
- A response after a successful request
- Paginated data for a list
- An error for a bad request or other errors
- No content after a deletion
- Catch a server error and return an error message without important knowledge of the system

### Setup
```
npm install express-responder --save
```
Can be used by your whole app or a router
```javascript
var repsonder = require('express-responder');
app.use(responder());
//or
var router = express.Router();
router.use(responder());

//How to use
router.get('/messages', function(req, res) {
  res.success({hello: 'world'});
})
```
Outputs `200`
```json
{
  "hello": "world"
}
```

### Return Success Response

Returns a JSON body. By default returns HTTP status code 200 but a code can be passed.
```javascript
res.success({item1: 'Hello', item2: false}, 201);
```
Output `200`
```json
{
  "item1": "Hello",
  "item2": false
}
```
### Return Error Response

Returns a JSON body with a message field for error handling. Defaults the HTTP status
code to 400. The message also defaults to a description based on the code

```javascript
res.error('Cant find your message', 404);
//Or default to the code descriptor
res.error(null, 404);
```

Output `404`
```json
{
  "message": "Cant find your message"
}
```
or
```json
{
  "message": "Not Found"
}
```

### Paginated Responses

Returns a JSON object with a list of data as well as some useful fields. Defaults 200 HTTP status code
```javascript
var data = [{name: 'Eric'}, {name: 'Dufresne'}, ...];
var totalCount = 50;
var page = 1;
var limit = 25;
res.paginate(data, totalCount, page, limit);
```

Output: `200`
```json
{
  "list": [
    {
      "name": "Eric"
    },
    {
      "name": "Dufresne"
    }
  ],
  "limit": 25,
  "page": 1,
  "count": "50",
  "pages": 2
}
```

### Catch Internal Server Error
Returns an error message based on the HTTP status code given for an unexpected error.
Defaults to HTTP status code 500 but a code can be passed.

```javascript
res.catch(err);
```
In production environment `500`
```json
{
  "message": "Internal Server Error"
}
```
if not in a production environment `500`
```json
{
  "message": "Table \"messages\" doesn't exist..."
}
```

### No Content
```javascript
res.noContent();
```
