const path = require('path');

module.exports = {
  mode: 'development', // Set mode to development
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Apply Babel to both .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/, // Apply style and CSS loaders to .css files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i, // Apply file loader to handle image files
        use: ['file-loader'],
      },
      {
        test: /\.md$/, // Apply markdown loader to handle Markdown files
        use: ['raw-loader'],
      },
    ],
  },
  resolve: {
    fallback: {
        "child_process": 'empty', 
        "fs": require.resolve("browserify-fs"), 
        "util": require.resolve("util"), 
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "tls": require.resolve("tls-browserify"),
        "net": require.resolve("net-browserify"),
        "crypto": require.resolve("crypto-browserify"), 
        "path": require.resolve("path-browserify"),
        "os": require.resolve("os-browserify"), 
        "stream": require.resolve("stream-browserify"),
        "zlib": require.resolve("browserify-zlib")
    }
}
  
};


// resolve: {
//   fallback: {
//     "events": false,
//     "url": false,
//     "assert": false,
//     "util": false,
//     "http": false ,
//     "https": false ,
//     "stream": false,
//     "stream": false,
//     "util": false,
//     "querystring": false,
//     "os": false,
//     "zlib": false,
//     "buffer": false,
//     "assert": false,
//     "http": require.resolve("stream-http"),
//     "https": require.resolve("https-browserify"),
//     "stream": require.resolve("stream-browserify"),
//     "querystring": require.resolve("querystring-es3"),
//     "os": require.resolve("os-browserify/browser"),
//     "zlib": require.resolve("browserify-zlib"), 
//   },
// },