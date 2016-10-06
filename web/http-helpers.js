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

// var writeResponse = (err, data) => {
//   if (err) {
//     res.writeHead(404, exports.headers);
//     res.end();
//   }
//   res.end(data, () => callback(res));
// };

// servepublicassets
exports.servePublicAssets = (res, url, callback) => {
  if (url.includes('.css')) {
    exports.headers['Content-Type'] = 'text/css';
  }
  if (url === '/') {
    url = '/index.html';
  }

  fs.readFile(path.join(archive.paths.siteAssets, url), (err, data) => {
    if (err) {
      res.writeHead(404, exports.headers);
      res.end();
    }
    res.end(data, () => callback(res));
  });
};

// serverarchiveassets
exports.serveArchiveAssets = (res, url, callback) => {
  fs.readFile(path.join(archive.paths.archivedSites, '/', url), (err, data) => {
    if (err) {
      res.writeHead(404, exports.headers);
      res.end();
    }
    res.end(data, () => callback(res));
  });
};


exports.postData = (req, res, callback) => {
  req.on('data', (data) => {
    var site = qs.parse(Buffer(data).toString()).url;
    var filePath = path.join(archive.paths.list);
    fs.appendFile(filePath, site + '\n'); // <-- CULPRIT!!!!!!! WAS OVERWRITING
    fs.readFile(archive.paths.siteAssets + '/loading.html', (err, staticdata) => {
      if (err) { 
        console.log('LOADING PAGE WONT LOAD LOL');
        res.writeHead(404, exports.headers);
        res.end();
      }
      res.writeHead(200, exports.headers);
      res.end(staticdata, () => callback(res));
    });
  });
};
