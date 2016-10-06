var fs = require('fs');
var path = require('path');
var _ = require('underscore');

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

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    callback(data.split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls((data) => {
    callback(_.contains(data, url));
  });
};

exports.addUrlToList = function(url, callback) {
  exports.isUrlInList(url, (bool) => {
    console.log(bool);
    if (!bool) {
      fs.appendFile(exports.paths.list, url + '\n', (err) => {
        if (err) {
          console.error(err);
        } else {
          callback();
        }
      });
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.exists(exports.paths.archivedSites + '/' + url, (exists) => {
    callback(exists);
  });
};

exports.downloadUrls = function(urls) {
  // for each url
  _.each(urls, (url) => {
    // if url is not archived
    exports.isUrlArchived(url, (result) => {
      if (!result) {
        // add url to list
        fs.writeFile(exports.paths.archivedSites + '/' + url, '');
      }
    });
  });
};
