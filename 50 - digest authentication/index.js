
var http = require( 'http' );
var crypto = require( 'crypto' );

var username = 'name', password = 'password',
    realm = 'testing', opaque;

md5 = msg => crypto.createHash( 'md5' ).update( msg ).digest( 'hex' );

opaque = md5( realm );

authenticate = res => {
    res.writeHead(
        401,
        {
            'WWW-Authenticate': 'Digest realm="' + realm + '"'
                + ',qop="auth",nonce="' + Math.random() + '"'
                + ',opaque="' + opaque + '"'
        }
    );
    res.end( 'Authorization required' );
}

parseAuth = auth => {
    var authObj = {};
    auth.split( ', ' ).forEach(
        pair => {
            pair = pair.split( '=' );
            authObj[ pair[ 0 ] ] = pair[ 1 ].replace( /"/g, '' );
        }
    );
    return authObj;
}

http.createServer(
    ( req, res ) => {
        var auth, user, digest = {};
        if ( !req.headers.authorization ) {
            authenticate( res );
            return;
        }
        auth = req.headers.authorization.replace( /^Digest /, '' );
        auth = parseAuth( auth );
        if ( auth.username !== username ) {
            authenticate( res );
            return;
        }
        digest.ha1 = md5( auth.username + ':' + realm + ':' + password );
        digest.ha2 = md5( req.method + ':' + auth.uri );
        digest.response = md5(
            [ digest.ha1, auth.nonce, auth.nc, auth.cnonce, auth.qop, digest.ha2 ]
            .join( ':' )
        );
        if ( auth.response !== digest.response ) {
            authenticate( res );
            return;
        }
        res.end( 'You made it!' );
    }
).listen( 8080 );

