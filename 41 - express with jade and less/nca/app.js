
const express      = require( 'express' );
const path         = require( 'path' );
const favicon      = require( 'serve-favicon' );
const logger       = require( 'morgan' );
const cookieParser = require( 'cookie-parser' );
const bodyParser   = require( 'body-parser' );
const less         = require( 'less-middleware' );
const fs           = require( 'fs' );

const index        = require( './routes/index' );
const users        = require( './routes/users' );


pathJoin = folder => path.join(__dirname, folder)

const app = express(),
  env     = app.get( 'env' ),
  dev     = 'development' === env,
  prd     = 'production' === env,
  views   = pathJoin( 'views' ),
  dest    = pathJoin( 'public' );
  
process.env.PORT = process.env.PORT || ( prd ? 80 : 3000 );

// view engine setup
app.set( 'views', views );
app.set( 'view engine', 'jade' );

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use( logger( dev ? 'dev' : { stream: fs.createWriteStream( 'log' ) } ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser() );
app.use( less( views, { dest } ) );
//app.use( less( views, { dest, once: true } ) );
app.use( express.static( dest ) );

app.use( '/', index );
app.use( '/users', users );

// catch 404 and forward to error handler
app.use(
  ( req, res, next) => {
    var err = new Error( 'Not Found' );
    err.status = 404;
    next( err );
  }
);

// error handler
app.use(
  ( err, req, res, next ) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = dev ? err : {};

    // render the error page
    res.status( err.status || 500 );
    res.render( 'error' );
  }
);

module.exports = app;
