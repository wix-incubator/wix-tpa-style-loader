/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Felix Mosheev
 */
var loaderUtils = require("loader-utils");

module.exports = function (content) {
  this.cacheable && this.cacheable();
  var query = loaderUtils.parseQuery(this.query);
};
