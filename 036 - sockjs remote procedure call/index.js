
const http = require( 'http' );
const clientHtml = require( 'fs' ).readFileSync( 'index.html' );


const httpServer = http.createServer(
    ( req, resp ) => {
        resp.writeHead( 200, { 'Client-type': 'text/html' } ),
        resp.end( clientHtml );
    }
).listen( 8080 );

let sockServer = require( 'sockjs' ).listen( httpServer, { prefix: '/sock' } );

sockServer.on(
    'connection',
    socket => {
        socket.on(
            'data',
            msg => {
                if ( 'Hello' === msg )
                    socket.write( 'SockJS' );
            }
        );
    }
);
