const fs = require("fs");
const path = require("path");
const { createHash } = require("crypto");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

const env = false ? "development" : "production";

function createPublicHash() {
  const files = fs.readdirSync(path.join(__dirname, "public"));
  const hash = createHash("sha256");
  for (let f of files) {
    hash.update(fs.readFileSync(path.join(__dirname, "public", f)));
  }
  return hash.digest("hex");
}

const oldHash = fs.readFileSync(path.join(__dirname, "hash"), "utf8");
if (env === "development" || oldHash !== createPublicHash()) {
  console.log("starting webpack");
  webpack(
    {
      mode: env,
      context: path.join(__dirname, "./"),
      entry: { "service-worker": "./app/service-worker.js" },
      output: {
        path: path.join(__dirname, "public"),
        filename: "[name].js"
      },
      target: "webworker",
      resolve: { extensions: [".js"] },
      plugins: [
        new CompressionPlugin({
          filename: "[path].br[query]",
          algorithm: "brotliCompress",
          test: /\.(js|css|html|svg)$/,
          compressionOptions: { level: 11 },
          minRatio: 1
        })
      ]
    },
    (err, stats) => {
      // Stats Object
      if (err || stats.hasErrors()) {
        console.log(stats.toString());
        if (err) console.log(err.stack || err);
        if (err && err.details) {
          console.error(err.details);
        }
        return;
      }
      console.log(stats.toString("normal"));
      if (env === "production")
        fs.writeFileSync(path.join(__dirname, "hash"), createPublicHash());
      console.log("finished service-worker webpack");
    }
  );
  webpack(
    {
      mode: env,
      context: path.join(__dirname, "./"),
      entry: { index: "./app/app.js" },
      output: {
        path: path.join(__dirname, "public"),
        filename: "[name].js",
        chunkFilename: "[name].js"
      },
      resolve: { extensions: [".js"] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            include: path.join(__dirname, "app"),
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env", "@babel/preset-react"]
              }
            }
          }
        ]
      },
      plugins: [
        new webpack.EnvironmentPlugin(["VAPID_PUBLIC_KEY"]),
        new HtmlWebpackPlugin({
          scriptLoading: "defer",
          filename: "../app/index.html",
          favicon: "./favicon.ico",
          inject: false,
          meta: { description: "A simple kitten push notification service." },
          templateContent: ({ htmlWebpackPlugin }) =>
            `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Purrer 😺💌</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="favicon.ico" />
    <link rel="preload" href="/index.js" as="script" />
    <link rel="preload" href="/commons~index.js" as="script" />
    <link rel="preload" href="/notificationEditor.js" as="script" />
    <link
      rel="preload"
      href="/commons~notificationEditor~themeEditor.js"
      as="script"
    />
    <link rel="preload" href="/commons~notificationFeed.js" as="script" />
    <link
      rel="preload"
      href="/commons~notificationEditor~notificationFeed~themeEditor.js"
      as="script"
    />
    <link
      rel="preload"
      href="/commons~notificationEditor~notificationFeed.js"
      as="script"
    />
    <link
      rel="preload"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400&display=swap"
      as="style"
    />
    <link rel="prefetch" href="/commons~themeEditor.js" as="script" />
  </head>
  <body>
    <div id="main"></div>
    <script defer="defer" src="/commons~index.js"></script>
    <script defer="defer" src="/index.js"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400&display=swap" />
  </body>
</html>
`
        }),
        new CompressionPlugin({
          filename: "[path].br[query]",
          algorithm: "brotliCompress",
          test: /\.(js|css|html|svg)$/,
          compressionOptions: { level: 11 },
          minRatio: 1
        })
      ],
      optimization: {
        splitChunks: {
          cacheGroups: {
            commons: {
              chunks: "all",
              minChunks: 1
            }
          }
        }
      }
    },
    (err, stats) => {
      // Stats Object
      if (err || stats.hasErrors()) {
        console.log(stats.toString());
        if (err) console.log(err.stack || err);
        if (err && err.details) {
          console.error(err.details);
        }
        return;
      }
      console.log(stats.toString("normal"));
      if (env === "production")
        fs.writeFileSync(path.join(__dirname, "hash"), createPublicHash());
      console.log("finished webpack");
    }
  );
} else {
  console.log("skipping build!");
}
