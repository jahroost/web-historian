var path = require('path');
var archive = require('../helpers/archive-helpers');
var qs = require('qs');
var fs = require('fs');
// require more modules/folders here!

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var results = [];

exports.handleRequest = function (req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  var headers = defaultCorsHeaders;


  if (req.method === 'POST') {
   headers['Content-Type'] = 'text/plain';
   var body = '';
   res.writeHead(201, headers);
   req.on('data', function(chunk) {
     body += chunk;
   });
   req.on('end', function() {
     //TODO add to results && end res
     results.push(qs.parse(body));
     res.end(JSON.stringify({results}));
   });
  }

  else if (req.method === 'GET') {
     headers['Content-Type'] = 'application/JSON';
     res.writeHead(200, headers);
     console.log('sending results', results)
     res.end(JSON.stringify({results}));
  }

  else if (req.method === 'OPTIONS') {
     res.writeHead(200, headers);
     res.end();
  }

  else {
     headers['Content-Type'] = 'text/plain';
     res.writeHead(404, headers);
     res.end('404');
  }
};
