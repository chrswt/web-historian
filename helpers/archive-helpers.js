var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var request = require('request');

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
exports.initialize = (pathsObj) => {
  _.each(pathsObj, (path, type) => {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!
exports.nukeListOfUrls = () => {
  fs.writeFile(exports.paths.list, '', 'utf8', (err) => {
    if (err) {
      console.error(err);
    }
  });
};

exports.readListOfUrls = (callback) => {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    callback(data.split('\n'));
  });
};

exports.isUrlInList = (url, callback) => {
  exports.readListOfUrls((data) => {
    console.log('LIST OF URLS: ', data);
    callback(_.contains(data, url));
  });
};

exports.addUrlToList = (url, callback) => {
  console.log('ADD URL BEING CALLED FOR SOME REASON');
  exports.isUrlInList(url, (bool) => {
    console.log(bool);
    if (!bool) {
      fs.appendFile(exports.paths.list, url + '\n', (err) => {
        err ? console.log(err) : callback();
      });
    }
  });
};

exports.isUrlArchived = (url, callback) => {
  fs.exists(exports.paths.archivedSites + '/' + url, (exists) => {
    callback(exists);
  });
};

exports.downloadUrls = urls => {
  _.each(urls, (url) => {
    exports.isUrlArchived(url, (result) => {
      if (!result) {
        var fullURL = 'https://' + url;
        request(fullURL, (err, res, body) => {
          if (!err && res.statusCode === 200) {
            fs.appendFile(exports.paths.archivedSites + '/' + url, body);
          } else {
            request('http://' + url, (err, res, body) => {
              if (!err && res.statusCode === 200) {
                fs.appendFile(exports.paths.archivedSites + '/' + url, body);
              }
            });
          }
        });
      }
    });
  });
};
