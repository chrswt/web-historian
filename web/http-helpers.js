var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var qs = require('querystring');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

var getStatic = function(res, site, callback) {
  fs.readFile(path.join(site), (err, data) => {
    if (err) { 
      res.writeHead(404, exports.headers);
      res.end();
    }
    res.end(data, () => callback(res));
  });
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)

  if (asset === '/') {
    getStatic(res, archive.paths.siteAssets + '/index.html', callback);
  } else {
    getStatic(res, archive.paths.archivedSites + '/' + asset, callback);
  }
};

exports.postData = function(req, res) {
  req.on('data', (data) => {
    var site = qs.parse(Buffer(data).toString()).url;
    var filePath = path.join(archive.paths.list);
    fs.writeFile(filePath, site + '\n');
    // send to loading.html after posting
    getStatic(res, archive.paths.siteAssets + '/loading.html');
    // getStatic()
  });
};


// As you progress, keep thinking about what helper functions you can put here!