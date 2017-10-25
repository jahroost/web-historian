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
   console.log("REQUEST URL: ", req.url);
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
    console.log('REQUEST URL',req.url);
    if ( req.url === '/') {
      fs.readFile(archive.paths.siteAssets + '/index.html', function(err, data) {
        console.log('GET DATA: ',data);
       //  headers['Content-Type'] = 'application/JSON';
        res.writeHead(200, {'Content-Type': 'text/html'});
       //  res.write();
       if( err ) {
         console.log('ERROR: ', err);
       }
        res.end(data);
      });
    } else if ( req.url.includes(archive.paths.archivedSites)) {
      fs.readFile(archive.paths.archivedSites + req.url, function(err, data) {
      console.log('GET DATA: ',data);
      res.writeHead(200, {'Content-Type': 'text/html'});
      if( err ) {
        console.log('ERROR: ', err);
      }
      res.end(data);
      });
    } else {
      res.writeHead(404, {'Content-Type': 'text/html'});
    }
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
