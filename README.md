# Wix TPA style loader
Webpack loader that handles Wix TPA style params.

## Installation

```
npm install wix-tpa-style-loader
```

## Usage
on scss file that contains **TPA style params**
``` scss
.foo {
	color: unquote("{{color-1}}");
	font: unquote("; {{body-m}}");
	font-size: 16px;
}
```
If you are using wix-node-build with `tpaStyle: true`, it will invoke this loader as part of scss requires and it will pass
the `remain` part.
``` css
// remain
.foo {
	font-size: 16px;
}
```
If you want to put a style tag with the TPA params you need to require SCSS file with `wix-tpa-style?mode=inline`.
```javascript
require('!wix-tpa-style-loader?mode=inline!scss!./style.scss');
```
This line will generate code in your bundle that on runtime will put style tag with `wix-style` attr to the head and the `inline` part in it.
```css
// inline
.foo {
	color: {{color-1}};
	font: ; {{body-m}};
}
```

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

## License

MIT (http://www.opensource.org/licenses/mit-license.php)