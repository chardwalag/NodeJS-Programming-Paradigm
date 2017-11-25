
const http = require( 'http' );
const fs   = require( 'fs' );

const file = 'C:\\AAAAA.txt';

const options = {
    file,
    fileSize: fs.statSync( file ).size,
    kbps: 32
};

http.createServer(
    ( req, resp ) => {
        let download = Object.create( options );
        download.chunks = new Buffer( download.fileSize );
        download.bufferOffset = 0;

        resp.writeHead(
            200,
            { 'Content-Length': options.fileSize }
        );

        fs.createReadStream( options.file ).once(
            'open',
            () => {
                const handleAbort = throttle(
                    download,
                    send => {
                        resp.write( send );
                    }
                );

                req.on( 'close', handleAbort );
            }
        ).on(
            'data',
            chunk => {
                chunk.copy( download.chunks, download.bufferOffset );
                download.bufferOffset += chunk.length;
            }
        );
    }
).listen( 8080 );

function throttle( download, cb ) {
    let chunkOutSize = download.kbps * 1024, timer = 0;

    (
        function loop( bytesSent ) {
            let remainingOffset;
            setTimeout(
                () => {
                    let bytesOut = bytesSent + chunkOutSize;
                    if ( download.bufferOffset > bytesOut ) {
                        timer = 1000;
                        cb( download.chunks.slice( bytesSent, bytesOut ) );
                        loop( bytesOut );
                        return;
                    }

                    if ( bytesOut >= download.chunks.length ) {
                        remainingOffset = download.chunks.length - bytesSent;
                        cb( download.chunks.slice( remainingOffset, bytesSent ) );
                        return;
                    }

                    loop( bytesSent );
                },
                timer
            );
        }
    )( 0 );

    return function() {
        download.aborted = true;
    }
}
