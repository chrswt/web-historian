var http = require('http');
var handler = require('./request-handler');
var initialize = require('./initialize.js');
var Cron = require('cron').CronJob;
var worker = require('../workers/htmlfetcher.js');

// Why do you think we have this here?
// HINT: It has to do with what's in .gitignore

initialize('./archives');
new Cron('0 * * * * *', function() {
  console.log('new cron made');
  worker();
}, null, true, 'America/Los_Angeles');

// try {
//   new Cron('1 * * * * *', function() {
//     console.log('this should not be printed');
//   })
// } catch (ex) {
//   console.log('cron pattern not valid');
// }

var port = 8080;
var ip = '127.0.0.1';
var server = http.createServer(handler.handleRequest);

if (module.parent) {
  module.exports = server;
} else {
  server.listen(port, ip);
  console.log('Listening on http://' + ip + ':' + port);
}

