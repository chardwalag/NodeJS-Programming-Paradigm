
var net = require( 'net' );
net.createServer(
    socket => {
        socket.end( 'Hello, this is TCP\n' );
        socket.on( 'data', d => console.log( d ) );
    }
).listen( 8080 );
