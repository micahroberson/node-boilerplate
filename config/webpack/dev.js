let path = require('path');
let fs = require('fs');
let webpack = require('webpack');
let WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
let webpackIsomorphicToolsConfig = require('./isomorphic');

var babelrc = fs.readFileSync('./.babelrc');
var babelConfig;
try {
  babelConfig = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

// Inject HMR plugin for development
babelConfig.env.client.presets.push('react-hmre');
let babelLoaderQuery = JSON.stringify(babelConfig.env.client);

let webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(webpackIsomorphicToolsConfig).development();

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      './src/client/index.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: 'http://localhost:8080/assets/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel?' + babelLoaderQuery },
      { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    webpackIsomorphicToolsPlugin
  ],
  devtool: '#inline-source-map'
};