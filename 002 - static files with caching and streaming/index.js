
const http = require( 'http' );
const path = require( 'path' );
const fs   = require( 'fs'   );


const mimeTypes = {
    '.js'  : 'text/javascript',
    '.html': 'text/html',
    '.css' : 'text/css'
};

let cache = {
    store     : {},
    maxSize   : 26214400,    // 25mb
    maxAge    : 5400 * 1000, // 1.5hrs
    cleanAfter: 7200 * 1000, // 2hrs
    cleanedAt : 0,

    clean: function( now ) {
        if ( now - this.cleanAfter > this.cleanedAt ) {
            const that = this;
            this.cleanedAt = now;
            Object.keys( this.store ).forEach(
                file => {
                    if ( now > that.store[ file ].timestamp + that.maxAge )
                        delete that.store[ file ];
                }
            )
        }
    }
};

http.createServer(
    ( req, resp ) => {
        const lookup = path.basename( decodeURI( req.url ) ) || 'index.html';
        const f = 'content/' + lookup;

        fs.exists(
            f,
            exist => {
                if ( exist ) {
                    const headers = { 'Content-type': mimeTypes[ path.extname( lookup ) ] };
                    if ( cache.store[ f ] ) {
                        resp.writeHead( 200, headers );
                        resp.end( cache.store[ f ] );
                        return;
                    }

                    const s = fs.createReadStream( f, { bufferSize: 1024 } ).once(
                        'open',
                        function() {
                            resp.writeHead( 200, headers );
                            this.pipe( resp );
                            fs.stat(
                                f,
                                ( err, stats ) => {
                                    if ( stats.size < cache.maxSize ) {
                                        let bufferOffset = 0;
                                        cache.store[ f ] = {
                                            content: new Buffer( stats.size ),
                                            timestamp: Date.now()
                                        };
                                        s.on(
                                            'data',
                                            chunk => {
                                                console.log( 'QQQQQQQQQ' );
                                                chunk.copy( cache.store[ f ].content, bufferOffset );
                                                bufferOffset += chunk.length;
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    ).once(
                        'error',
                        e => {
                            console.log( e );
                            resp.writeHead( 500 );
                            resp.end( 'Server error' );
                        }
                    );
                    return;
                }

                resp.writeHead( 404 );
                resp.end();
            }
        );
        cache.clean( Date.now() );
    }
).listen( 8080 );

