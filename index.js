/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Felix Mosheev
 */
const loaderUtils = require('loader-utils');
const extractStyles = require('postcss-extract-styles');
const postcss = require('postcss');
const path = require('path');

module.exports = function (content) {
  this.cacheable && this.cacheable();
  const query = loaderUtils.parseQuery(this.query);
  const options = {
    pattern: /\[\[[^\]]+\]\]/,
    remove: query.type !== 'inline'
  };

  const done = this.async();
  if (!done) return content;

  // Convert curlies to brackets
  content = content.replace(/font: ?; ?{{([^}]+)}};/g, 'font: [[$1]];');
  content = content.replace(/{{([^}]+)}}/g, '[[$1]]');
  postcss([extractStyles(options)])
    .process(content)
    .then(function (result) {
      let css = result.css;

      if (query.type === 'inline') {
        //Convert brackets to curlies
        css = css.replace(/font: \[\[([^\]]+)\]\];/g, 'font:;{{$1}};');
        css = css.replace(/\[\[([^\]}]+)\]\]/g, '{{$1}}');

        // Inject style tag
        css = [
          '// load the inline styles',
          'var inlineCss = ' + JSON.stringify(css) + ';',
          'require(' + loaderUtils.stringifyRequest(this, '!' + path.join(__dirname, 'addStyles.js')) + ')(inlineCss);'
        ].join('\n');
      }
      console.log(css);

      done(null, css);
    })
    .catch(function (error) {
      console.error(error);
      done(error);
    });
};
