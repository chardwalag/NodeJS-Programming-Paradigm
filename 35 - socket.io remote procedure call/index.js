
const http = require( 'http' );
const clientHtml = require( 'fs' ).readFileSync( 'index.html' );


const httpServer = http.createServer(
    ( req, resp ) => {
        resp.writeHead( 200, { 'Client-type': 'text/html' } ),
        resp.end( clientHtml );
    }
).listen( 8080 );

const io = require( 'socket.io' ).listen( httpServer );

io.sockets.on(
    'connection',
    socket => {
        socket.on(
            'give me a number',
            cb => {
                cb( 4 );
            }
        );
        socket.emit(
            'give me a sentence',
            sentence => {
                socket.send( Buffer( sentence ).toString( 'base64' ) );
            }
        );
    }
);
