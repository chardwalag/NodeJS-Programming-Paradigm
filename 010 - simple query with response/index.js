
const http     = require( 'http' );
const url      = require( 'url' );
const profiles = require( './profiles' );


http.createServer(
    ( req, resp ) => {
        let urlObj = url.parse( req.url, true ),
            cb = urlObj.query.callback, who = urlObj.query.who, profile;

        if ( cb && who ) {
            profile = cb + '(' + JSON.stringify( profiles[ who ] ) + ')';
            resp.end( profile );
        }
    }
).listen( 8080 );
