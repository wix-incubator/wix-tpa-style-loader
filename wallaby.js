module.exports = function (wallaby) {
  return {
    files: [
      {pattern: 'node_modules/babel-polyfill/dist/polyfill.js', instrument: false},
      'src/**/*.js',
      'test/**/*.mock.js'
    ],

    tests: [
      'test/**/*.spec.js'
    ],

    testFramework: 'mocha',
    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },
    env: {
      type: 'node'
    }
  };
};