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

    req.on('data', requestData => {
      var requestedURL = requestData.toString().slice(4);

      archive.isUrlInList(requestedURL, result => {
        console.log('REQUEST URL: ', requestedURL);
        if (!result) {
          console.log('I AM NOT IN THE LIST :(');
          helpers.postData(req, res, asset => asset);
        } else {
          console.log('I AM IN THE LIST!');
          helpers.serveAssets(res, req.url, asset => asset);
        }
      });
    });

    // why does removing these weird things make 1 test fail??
    console.log('this fell through!!!!!!!');
    // DISCOVERY: POST request on '/' falls through
    console.log(req.url, req.method);
    // console.log(res);
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
