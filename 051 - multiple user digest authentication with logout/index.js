
var http = require( 'http' );
var crypto = require( 'crypto' );

var users = { 'name': { password: 'name' }, 'name2': { password: 'name2' } },
    realm = 'testing', opaque;

md5 = msg => crypto.createHash( 'md5' ).update( msg ).digest( 'hex' );

opaque = md5( realm );

authenticate = ( res, username ) => {
    var uRealm = realm, uOpaque = opaque;
    if ( username ) {
        uRealm = users[ username ].uRealm;
        uOpaque = users[ username ].uOpaque;
    }
    res.writeHead(
        401,
        {
            'WWW-Authenticate': 'Digest realm="' + uRealm + '"'
                + ',qop="auth",nonce="' + Math.random() + '"'
                + ',opaque="' + uOpaque + '"'
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
        if ( !users[ auth.username ] ) {
            authenticate( res );
            return;
        }
        if ( req.url === '/logout' ) {
            users[ auth.username ].uRealm = realm + ' [' + Math.random() + ']';
            users[ auth.username ].uOpaque = md5( users[ auth.username ].uRealm );
            users[ auth.username ].forceLogout = true;
            res.writeHead( 302, { 'Location': '/' } );
            res.end();
            return;
        }
        if ( users[ auth.username ].forceLogout ) {
            delete users[ auth.username ].forceLogout;
            authenticate( res, auth.username );
        }
        digest.ha1 = md5( auth.username + ':' + ( users[ auth.username ].uRealm || realm )
            + ':' + users[ auth.username ].password );
        digest.ha2 = md5( req.method + ':' + auth.uri );
        digest.response = md5(
            [ digest.ha1, auth.nonce, auth.nc, auth.cnonce, auth.qop, digest.ha2 ]
            .join( ':' )
        );
        if ( auth.response !== digest.response ) {
            users[ auth.username ].uRealm = realm + ' [' + Math.random() + ']';
            users[ auth.username ].uOpaque = md5( users[ auth.username ].uRealm );
            authenticate( res, users[ auth.username ].uRealm && auth.username );
            return;
        }
        res.writeHead( 200, { 'Content-type': 'text/html' } );
        res.end( 'You made it! <br> <a href="logout"> [ logout ] </a>' );
    }
).listen( 8080 );

