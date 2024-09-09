
const path = require( 'path' ),
{ CleanWebpackPlugin } = require( 'clean-webpack-plugin' ),
HtmlWebpackPlugin = require( 'html-webpack-plugin' );


module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(  __dirname, './dist' ),ui
  },
  mode: 'development',
  devServer: {
    port: 9000,
    static: {
      directory: path.resolve( __dirname, '/dist' )
    },
     devMiddleware: {
       index: 'index.html',
       writeToDisk: true
     }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader', 'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        '**/*',
        path.join( process.cwd(), 'build/**/*' )
      ]
    }),
    new HtmlWebpackPlugin({
      title: 'Video Call Test App',
      filename: 'public/index.html',
      description: 'Video Call Test App',
      minify: false
    })
  ]
}
