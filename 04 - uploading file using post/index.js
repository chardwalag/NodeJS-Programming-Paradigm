
const http        = require( 'http' );
const formidable  = require( 'formidable' );
const form        = require( 'fs' ).readFileSync( 'form.html' );


http.createServer(
    ( req, resp ) => {
        if ( 'POST' === req.method ) {
            const incoming = new formidable.IncomingForm();
            incoming.uploadDir = 'uploads';
            incoming.on(
                'fileBegin',
                ( field, file ) => {
                    if ( file.name ) {
                        file.path += '-' + file.name;
                    }
                }
            ).on(
                'file',
                ( field, file ) => {
                    if ( !file.size )
                        return;

                    resp.write( file.name + ' received\n' );
                }
            ).on(
                'field',
                ( field, value ) => {
                    resp.write( field + ' : ' + value + '\n' )
                }
            ).on(
                'end',
                () => {
                    resp.end( 'All files received.' );
                }
            );
            incoming.parse( req );
        }
        if ( 'GET' === req.method ) {
            resp.writeHead( 200, { 'Content-Type': 'text/html' } );
            resp.end( form );
        }
    }
).listen( 8080 );
