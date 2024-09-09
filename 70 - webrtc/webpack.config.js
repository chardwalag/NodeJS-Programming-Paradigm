
const path = require( 'path' ),
{ CleanWebpackPlugin } = require( 'clean-webpack-plugin' ),
HtmlWebpackPlugin = require( 'html-webpack-plugin' ),
MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );


module.exports = {
  entry: './public/js/index.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(  __dirname, './dist' ),
  },
  mode: 'production',
  node: false,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader'
        ]
      },
      {
        test: /\.m?js$/,
        use: {
            loader: 'babel-loader',
            options: {
              presets: [ '@babel/preset-env' ],
              plugins: [ '@babel/plugin-transform-object-assign' ]
            }
        }
      },
      {
        test: /\.js$/,
        loader: "webpack-remove-debug",
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new CleanWebpackPlugin({
    //   cleanOnceBeforeBuildPatterns: [
    //     '**/*',
    //     path.join( process.cwd(), 'build/**/*' )
    //   ]
    // }),
    // new HtmlWebpackPlugin({
    //   title: 'Video Call Test App',
    //   filename: 'index.html',
    //   description: 'Video Call Test App'
    // })
  ]
}
