
const http = require( 'http' );
const path = require( 'path' );
const fs   = require( 'fs'   );


const mimeTypes = {
    '.js'  : 'text/javascript',
    '.html': 'text/html',
    '.css' : 'text/css'
};

let cache = {};
cacheAndDeliver = ( f, cb ) => {
    fs.stat(
        f,
        ( err, stats ) => {
            if ( err )
                return console.log( 'Error...' );

            const lastChanged = Date.parse( stats.ctime );
            const isUpdated = cache[ f ] && lastChanged > cache[ f ].timestamp;
            
            if ( !cache[ f ] || isUpdated ) {
                fs.readFile(
                    f,
                    ( err, data ) => {
                        console.log( 'loading ' + f + ' from file' )
                        cache[ f ] = { content: data, timestamp: lastChanged };
                        cb( err, data );
                    }
                )
                return;
            }

            console.log( 'loading ' + f + ' from cache' );
            cb( null, cache[ f ].content );
        }
    );
}

http.createServer(
    ( req, resp ) => {
        const lookup = path.basename( decodeURI( req.url ) ) || 'index.html';
        const f = 'content/' + lookup;

        fs.exists(
            f,
            exist => {
                if ( exist ) {
                    cacheAndDeliver(
                         f,
                         ( err, data ) => {
                            if ( err ) {
                                resp.writeHead( 500 );
                                resp.end( 'Server error' );
                                return;
                            }
    
                            const headers = { 'Content-type': mimeTypes[ path.extname( lookup ) ] };
                            resp.writeHead( 200, headers );
                            resp.end( data );
                        }
                    );

                    return;
                }

                resp.writeHead( 404 );
                resp.end();
            }
        );
    }
).listen( 8080 );

