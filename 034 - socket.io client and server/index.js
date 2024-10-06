
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
        socket.emit( 'hello', 'socket.io' );
        socket.on(
            'message',
            msg => {
                if ( 'Hello' === msg )
                    socket.send( 'socket.io' );
            }
        );
        socket.on(
            'hollaback',
            from => {
                console.log( 'Received a hollaback from ' + from );
            }
        );
    }
);
