var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
// require more modules/folders here!

var actions = {
  'GET': (req, res) => {
    res.writeHead(200, helpers.headers);
    helpers.serveAssets(res, req.url, asset => asset);  
  },
  'POST': (req, res) => {
    res.writeHead(302, helpers.headers);
    archive.isUrlInList(req.url, result => {
      if (!result) {
        helpers.postData(req, res);
      } else {
        helpers.serveAssets(res, req.url, asset => asset);
      }
    });
    helpers.postData(req, res);
    helpers.serveAssets(res, req.url, asset => asset);
  }
};

exports.handleRequest = (req, res) => {
  if (!actions[req.method]) {
    res.writeHead(404, helpers.headers);
    res.end();
  } else {
    actions[req.method](req, res);
  }
};
