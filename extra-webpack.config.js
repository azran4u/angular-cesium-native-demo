const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  resolve: {
    fallback: {
      http: false,
      https: false,
      zlib: false,
    },
  },
  // plugins: [new NodePolyfillPlugin()],
  module: {
    unknownContextCritical: false,
  },
};
