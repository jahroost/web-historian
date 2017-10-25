var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */
 //not sure if we should be instantiating dirname here

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

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  console.log('got to readListOfUrls');
  fs.readFile(this.paths.list, function(err, data) {
    data = data.toString();
    data = data.split('\n')
    console.log('url DATA: ',data);
    callback(data);
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(this.paths.list, function(err, data) {
    data = data.toString();
    data = data.split('\n')
    console.log('url DATA: ',data);
    callback(data.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(this.paths.list, url, function (err) {
    if (err) throw err;
    console.log('Updated!');
  });
  callback();
};

exports.isUrlArchived = function(url, callback) {

};

exports.downloadUrls = function(urls) {
};
