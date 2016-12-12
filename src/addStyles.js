module.exports = function (css) {
  if (typeof document !== 'object') throw new Error('The wix-tpa-style-loader cannot be used in a non-browser environment');

  createStyleElement(css);
};

function createStyleElement(css) {
  var styleElement = document.createElement('style');
  styleElement.type = 'text/css';
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
  return styleElement;
}

function insertStyleElement(styleElement) {
  var head = document.head || document.getElementsByTagName('head')[0];
  head.appendChild(styleElement);
}
