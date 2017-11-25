
const http        = require( 'http' );
const querystring = require( 'querystring' );
const util        = require( 'util' );
const form        = require( 'fs' ).readFileSync( 'form.html' );


const maxDataSize = 2 * 1024 * 1024; // 2mb

http.createServer(
    ( req, resp ) => {
        if ( 'GET' === req.method ) {
            resp.writeHead( 200, { 'Content-Type': 'text/html' } )
            resp.end( form );
            return;
        }
        if ( 'POST' === req.method ) {
            let postData = '';
            req.on(
                'data',
                function( chunk ) {
                    postData += chunk;
                    if ( postData.length > maxDataSize ) {
                        postData = '';
                        this.destroy();
                        resp.writeHead( 413 ); // request entity too large
                        resp.end( 'Too large' );
                    }
                }
            ).on(
                'end',
                () => {
                    if ( !postData ) {
                        resp.end();
                        return;
                    }
                    let postDataObj = querystring.parse( postData );
                    console.log( 'User posted:\n' + postData );
                    resp.end( 'You posted:\n' + util.inspect( postDataObj ) );
                }
            );
        }
    }
).listen( 8080 );
