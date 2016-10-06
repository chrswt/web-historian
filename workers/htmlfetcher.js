// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');

// does not support walmart.com (and only walmart.com), sorry fred
archive.readListOfUrls((list) => { 
  archive.nukeListOfUrls();
  var list = list.slice(0, list.length - 1);
  archive.downloadUrls(list);
});
