var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
// require more modules/folders here!

var actions = {
  'GET': function(req, res) {
    res.writeHead(200, helpers.headers);
    helpers.serveAssets(res, req.url, (asset) => asset);  
  },
  'POST': function(req, res) {
    res.writeHead(302, helpers.headers);
    // call helper to see if page exists in sites.txt
    archive.isUrlInList(req.url, (result) => {
      if (!result) { // page does not exist
      // send to helpers.postData
        helpers.postData(req, res);
      } else { // page does exist
        helpers.serveAssets(res, req.url, (asset) => asset);
      }
    });
    // if yes, 
      // serve them that page!
    helpers.postData(req, res);
    helpers.serveAssets(res, req.url, (asset) => asset);
  }
};

exports.handleRequest = function (req, res) {
  if (!actions[req.method]) {
    res.writeHead(404, helpers.headers);
    res.end();
  } else {
    actions[req.method](req, res);
  }
};
