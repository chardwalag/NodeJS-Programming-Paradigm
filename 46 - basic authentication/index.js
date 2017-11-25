
var http = require( 'http' );

var username = 'name', password = 'pwd', realm = 'testing';

http.createServer(
    ( req, res ) => {
        var auth, login;
        if ( !req.headers.authorization ) {
            authentication( res );
            return;
        }
        auth = req.headers.authorization.replace( /^Basic /, '' );
        auth = ( new Buffer( auth, 'base64' ) ).toString( 'utf8' );
        login = auth.split( ':' );
        if ( login[ 0 ] === username && login[ 1 ] === password ) {
            res.end( 'Someone likes soft cheese' );
            return;
        }
        authentication( res );
    }
).listen( 8080 );

authentication = res => {
    res.writeHead( 401, { 'WWW-Authenticate': 'Basic realm="' + realm + '"' } );
    res.end( 'Authentication required' );
}
