var path = require('path');
var archive = require('../helpers/archive-helpers');
var qs = require('qs');
var fs = require('fs');

var httpHelpers = require('./http-helpers.js')
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
    console.log("REQUEST URL: ", req.url);

    req.on('data', function(chunk) {

     console.log('REQUESTED SITES: ', chunk.toString());
     archive.isUrlInList(req.url, function (exists) {
       console.log('EXISTS: ', exists)
       if (!exists) {
         console.log('IN addUrlToList')
         var site = chunk.slice(4);
         fs.appendFile(archive.paths.list, site, function (err) {
           if (err) throw err;
         });
       } else {
         // redirect to loading or archived version of page
       }
     });

    });
    res.writeHead(302, httpHelpers.headers);
    res.end('<!DOCTYPE html><html><head><link rel="stylesheet" type="text/css" href="styles.css" /></head><body><form method="POST"><input type="input" name="url"></input></form>Our robots are currently archiving the site you requested. Please check back soon for a freshly embalmed copy!</body></html>');
    }

  else if (req.method === 'GET') {

    if ( req.url === '/') {
      fs.readFile(archive.paths.siteAssets + '/index.html', function(err, data) {
        res.writeHead(200, httpHelpers.headers);
        if( err ) {console.log('ERROR: ', err);}
        res.end(data);
      });
    }


    else {
      fs.readFile(archive.paths.siteAssets + req.url, function(err, data) {
         if( err ) {
          fs.readFile(archive.paths.archivedSites + req.url, function(err, data) {
            res.writeHead(200, httpHelpers.headers);

            if ( err ) {
              console.log('ARCHIVE ERROR');
              res.writeHead(404, httpHelpers.headers);
              res.end();
            } else{
              res.end(JSON.stringify(data));
            }
          });
        }
         //   console.log('GET DATA SITE REQUESTS: ',data);
         res.writeHead(200, httpHelpers.headers);
         res.end(JSON.stringify(data));
        // }
      });
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
