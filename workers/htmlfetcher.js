// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
// does not support walmart.com (and only walmart.com), sorry fred

module.exports = () => {
  console.log('Set off worker in htmlfetcher!!!!!!!!');
  archive.readListOfUrls((list) => { 
    archive.nukeListOfUrls();
    var list = list.slice(0, list.length - 1);
    archive.downloadUrls(list);
  });
};
