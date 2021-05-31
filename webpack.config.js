const handlebars = require('handlebars')
const vars = require('./vars.json')

const PORT = process.env.PORT || 5009

const IS_PROD = process.env.NODE_ENV === 'production' ? true : false

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/build',
    filename: 'index.js',
    library: {
      type: 'umd',
    },
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['autoprefixer']],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          preprocessor: (content) => handlebars.compile(content)(vars),
        },
      },
    ],
  },
  stats: 'errors-only',
  devtool: IS_PROD ? false : 'eval',
  devServer: {
    contentBase: __dirname + '/public',
    compress: true,
    port: PORT,
    historyApiFallback: true,
    hot: true,
  },
  mode: IS_PROD ? 'production' : 'development',
}
