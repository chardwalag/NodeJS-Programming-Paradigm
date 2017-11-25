
const http = require( 'http' );


const pages = {
    '/'            : 'XXXXX',
    '/about'       : 'A simple routing with Node example',
    '/about/this'  : 'Multilevel routing with Node',
    '/about/node'  : 'Evented I/O for v8 Javascript',
    '/another page': route => { return "Here's " + route; }
};

http.createServer(
    ( req, resp ) => {
        const lookup = decodeURI( req.url );
        if ( '' === lookup ) {
            resp.writeHead( 200, { 'Content-Type': 'text/html' } );
            resp.end( 'XXXXX' );
        } else if ( undefined === pages[ lookup ] ) {
            resp.writeHead( 404 );
            resp.end( 'Page not found!' );
        }
        else {
            const output = pages[ lookup ];
            resp.writeHead( 200, { 'Content-Type': 'text/html' } );
            resp.end( typeof output === 'function' ? output( lookup ) : output );
        }
    }
).listen( 8080 );

