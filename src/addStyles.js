module.exports = function (css) {
  if (typeof document !== 'object') {
    throw new Error('The wix-tpa-style-loader cannot be used in a non-browser environment');
  }

  createStyleElement(css);
};

function createStyleElement(css) {
  var styleElement = document.querySelector('#injected-style') || document.createElement('style');

  if(!styleElement.parentNode) {
    styleElement.setAttribute('type', 'text/css');
    styleElement.setAttribute('id', 'injected-style');
    styleElement.setAttribute('wix-style', '');

    if (styleElement.styleSheet) {
      styleElement.styleSheet.cssText = css;
    } else {
      while (styleElement.firstChild) {
        styleElement.removeChild(styleElement.firstChild);
      }
      styleElement.appendChild(document.createTextNode(css));
    }
    insertStyleElement(styleElement);
  } else {
    styleElement.originalTemplate = css;
    styleElement.setAttribute('hot-reloaded', 'true');
  }
  return styleElement;
}

function insertStyleElement(styleElement) {
  var head = document.head || document.getElementsByTagName('head')[0];
  head.appendChild(styleElement);
}
