var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */
exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

exports.readListOfUrls = function(callback) {
  fs.readFile(this.paths.list, function(err, data) {
    data = data.toString();
    data = data.split('\n')
    callback(data);
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(this.paths.list, function(err, data) {
    data = data.toString();
    data = data.split('\n')
    callback(data.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  // if ( !url.includes('\n') ) {
  //   url = url + '\n';
  // }
  var file = url + '\n'
  fs.appendFile(this.paths.list, file, function (err) {
    if (err) throw err;
  });
  callback();
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(this.paths.archivedSites, function ( err, files ) {
    console.log('FILES: ', files);
    callback(files.includes(url));
  });
};

exports.downloadUrls = function(urls) {

  var file = this.paths.archivedSites + '/';
  urls.forEach( function ( url ) {
    url = 'http://' + url;
    filePath = file + url.slice(7);
    request(url).pipe(fs.createWriteStream(filePath));
  })
  // urls.forEach( function(url) {
  //   url = 'http://' + url;
  //   request(url, function (error, response, body) {
  //     console.log('URL download:', url); // Print the error if one occurred
  //     console.log('DOWNLOAD body:', body); // Print the HTML for the Google homepage.
  //     var file = this.paths.archivedSites + url.slice(7);
  //     console.log('FILE PATH = ', file);
  //     fs.writeFile(file, body, function(err) {
  //       console.log('Download URL writeFile error');
  //     });
  //   });
  // });
};
