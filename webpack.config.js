const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");

module.exports = (env = {}) => {

  const { mode = "development" } = env;

  const isProd = mode === "production";
  const isDev = mode === "development";

  const getStyleLoaders = () => {
    return [
      isProd ? MiniCssExtractPlugin.loader : "style-loader"
    ]
  }

  const getPlugins = () => {
    const plugins = [
        new HtmlWebpackPlugin({
          title: "React JS",
          template: "./src/index.html",
        })
      ];
      if (isProd) {
        plugins.push(new MiniCssExtractPlugin({
          filename: "main-[hash:8].css",
        }))
      }
      return plugins
  }
  
  return {
    mode: isProd ? "production" : isDev && "development",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "[name].bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.(js)x?$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [ ...getStyleLoaders(),
            {
              loader: 'css-loader',
              options: { sourceMap: true },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  sourceMap: true,
                  plugins: [
                    autoprefixer,
                  ],
                }
              },
            },
            {
              loader: 'sass-loader',
              options: { 
                sourceMap: true,
                sassOptions: {
                  outputStyle: "compressed",
                },
              },
            },
          ],
        },
        {
          test: /\.(png|gif|svg|jpe?g)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[path][name].[ext]",
              },
            },
            "img-loader",
          ],
        },
        {
          test: /\.(ttf|otf|eot|woff|woff2)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "fonts",
                name: "[name].[ext]",
              },
            },
          ],
        },
      ],
    },
    plugins: getPlugins(),
    devServer: {
      contentBase: path.resolve(__dirname, "./dist"),
      open: true,
      compress: true,
      port: 9000,
    },
  };
};
