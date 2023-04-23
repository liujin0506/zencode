const webpack = require("webpack");

const config = {
  webpack5: false,
  webpack(config, options) {
    config.node = {
      fs: "empty",
      module: "empty",
      net: "mock",
      tls: "mock"
    };

    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.DEV": JSON.stringify(options.dev),
        IN_BROWSER: !options.isServer,
        IS_DEV: options.dev
      })
    );

    config.module.rules.unshift({
      test: /\.worker\.ts/,
      use: {
        loader: "worker-loader",
        options: {
          name: "static/[hash].worker.js",
          publicPath: "/_next/"
        }
      }
    });

    config.output.globalObject = 'typeof self !== "object" ? self : this';

    // Temporary fix for https://github.com/zeit/next.js/issues/8071
    config.plugins.forEach(plugin => {
      if (plugin.definitions && plugin.definitions["typeof window"]) {
        delete plugin.definitions["typeof window"];
      }
    });

    config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";

    return config;
  },
  async headers() {
    return [
      {
        // This works, and returns appropriate Response headers:
        source: "/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=180, s-maxage=180, stale-while-revalidate=180"
          }
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/json-to-formatter",
        permanent: false
      }
    ];
  }
};

module.exports = config;
