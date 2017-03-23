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
  const query = loaderUtils.getOptions(this) || {};
  const options = {
    pattern: /\[\[[^\]]+\]\]/
  };

  const done = this.async();
  if (!done) {
    return content;
  }

  // Convert curlies to brackets
  content = content.replace(/font: ?; ?{{([^}]+)}};?/g, 'font: [[$1]];');
  content = content.replace(/{{([^}]+)}}/g, '[[$1]]');

  postcss([extractStyles(options)])
    .process(content)
    .then(function (result) {
      if (query.mode === 'inline') {
        result = result.extracted;
        //Convert brackets to curlies
        result = result.replace(/font: \[\[([^\]]+)\]\];?/g, 'font:;{{$1}};');
        result = result.replace(/\[\[([^\]}]+)\]\]/g, '{{$1}}');

        // Inject style tag
        result = [
          '// load the inline styles',
          'var inlineCss = ' + JSON.stringify(result) + ';',
          'require(' + loaderUtils.stringifyRequest(this, '!' + path.join(__dirname, 'addStyles.js')) + ')(inlineCss);',
          'if(module.hot) {',
          '  module.hot.accept();',
          '  if(document.querySelector(\'style[hot-reloaded]\') && window.Wix) {',
          '    window.Wix.Styles.getStyleParams(function(style){',
          '      window.postMessage(JSON.stringify({intent: \'addEventListener\', eventType:window.Wix.Events.STYLE_PARAMS_CHANGE, params:{style: style}}), \'*\')',
          '    })',
          '  }',
          '}'
        ].join('\n');
      } else {
        result = result.css;
      }

      done(null, result);
    }.bind(this))
    .catch(function (error) {
      done(error.toString());
    });
};
