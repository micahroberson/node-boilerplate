import path from 'path';
let rootDir = path.resolve(__dirname, '../..');

let WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../../config/webpack/isomorphic'))
  .development(process.env.NODE_ENV === 'development')
  .server(rootDir, function() {
    require('./server');
  });
