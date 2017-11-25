
var net = require( 'net' ),
    PassThroughStream = require( 'stream' ).PassThrough,
    stream = new PassThroughStream();

net.createServer(
    { allowHalfOpen: true },
    socket => {
        socket.end( 'Hello, this is TCP\n' );
        socket.pipe( stream, { end: false } );
    }
).listen( 8080 );

net.createServer(
    socket => {
        stream.on( 'data', d => { d += ''; socket.write( Date() + ' ' + d.toUpperCase() ); } );
        socket.pipe( stream );
    }
).listen( 8081 );
