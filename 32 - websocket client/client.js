
let WebSocket = require( 'ws' ), ws = new WebSocket( 'ws://localhost:8080' );

process.stdin.resume();
process.stdin.setEncoding( 'utf8' );

process.stdin.on(
    'data',
    msg => {
        msg = msg.trim();
        ws.send( msg, console.log.bind( null, 'Send:', msg ) );
    }
);

ws.on(
    'message',
    msg => {
        console.log( 'Received:', msg );
    }
);

ws.on(
    'close',
    ( code, desc ) => {
        console.log( 'Disconnected:', code + '-' + desc );
    }
);

ws.on(
    'error',
    e => {
        console.log( 'Error:', e.code );
    }
);
