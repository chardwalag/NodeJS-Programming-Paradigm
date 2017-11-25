
const http = require( 'http' );
const fs   = require( 'fs' );


const form  = fs.readFileSync( 'put_upload_form.html' );
http.createServer(
    ( req, resp ) => {
        if ( 'PUT' === req.method ) {
            let fileData = new Buffer( +req.headers[ 'content-length' ] );
            let bufferOffset = 0;
            req.on(
                'data',
                chunk => {
                    chunk.copy( fileData, bufferOffset );
                    bufferOffset += chunk.length;
                }
            ).on(
                'end',
                () => {
                    const rand = ( Math.random() * Math.random() ).toString( 16 ).replace( '.', '' );
                    const to = 'uploads/' + rand + '-' + req.headers[ 'x-uploadedfilename' ];

                    fs.writeFile(
                        to,
                        fileData,
                        err => {
                            if ( err )
                                throw err;
                            
                            console.log( 'Saved file to ' + to );
                            resp.end();
                        }
                    )
                }
            );
        }
        if ( 'GET' === req.method ) {
            resp.writeHead( 200, { 'Content-Type': 'text/html' } );
            resp.end( form );
        }
    }
).listen( 8080 );
