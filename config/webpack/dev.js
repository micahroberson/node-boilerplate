let path = require('path');
let fs = require('fs');
let webpack = require('webpack');

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

module.exports = {
  entry: {
    app: [
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
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel?' + babelLoaderQuery }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin()
  ],
  progress: true,
  devtool: 'eval-source-map',
  debug: true
};