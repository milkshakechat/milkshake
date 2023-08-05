const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
    configure: (webpackConfig, { env, paths }) => {
      if (env === "production") {
        const terserPlugin = new TerserPlugin({
          // Your options here.
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        });

        // Push the plugin to the existing plugins array.
        webpackConfig.plugins.push(terserPlugin);
      }
      // toggle enable source maps (mainly for sentry bugs)
      // if (env === "production") {
      //   webpackConfig.devtool = false;
      // }

      return webpackConfig;
    },
  },
  babel: {
    plugins: [],
  },
};
