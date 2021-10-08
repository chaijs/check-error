module.exports = function configureKarma(config) {
  config.set({
    basePath: '',
    browsers: [ 'ChromeHeadless' ],
    logLevel: process.env.npm_config_debug ? config.LOG_DEBUG : config.LOG_INFO,
    frameworks: [ 'mocha' ],
    files: [ { pattern: './dist/test.bundle.js', type: 'module' } ],
    reporters: [ 'progress', 'coverage' ],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage',
    },
    port: 9876,
    colors: true,
    concurrency: 3,
    autoWatch: false,
    singleRun: true,
  });
};
