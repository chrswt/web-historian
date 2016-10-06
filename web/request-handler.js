var path = require('path');
var URL = require('url');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var _ = require('underscore');
var qs = require('querystring');

var urlStripper = url => {
  var httpFinder = /(https?):\/\//;
  var wwwFinder = /(www.)/;
  return url.replace(httpFinder, '').replace(wwwFinder, '');
};

exports.handleRequest = (req, res) => {
  // if req method is GET serve public asset
  if (req.method === 'GET') {
    helpers.servePublicAssets(res, req.url, _.identity);  
  // if req method is POST serve public or archive asset
  } else if (req.method === 'POST') {
    req.on('data', (data) => {
      var site = urlStripper(qs.parse(Buffer(data).toString()).url);
      console.log('Stripped URL: ', site);
      // console.log("URL testing: ", site, URL.parse('http://' + site));
      archive.isUrlArchived(site, (archived) => {
        console.log('site: ', site, 'archived: ', archived);
        if (archived) { 
          helpers.serveArchiveAssets(res, site, _.identity);
        } else {
          archive.isUrlInList(site, inList => {
            console.log(inList);
            if (!inList) {
              archive.addUrlToList(site, _.identity);
            }
            helpers.servePublicAssets(res, '/loading.html', _.identity);
          });
        }
      });
    });
  // otherwise, 404
  } else {
    res.writeHead(404, helpers.headers);
    res.end();
  }
};
