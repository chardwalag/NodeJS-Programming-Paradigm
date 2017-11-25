
const WSServer = require( 'ws' ).Server,
    wss = new WSServer( { port: 8080 } );

wss.on(
    'connection',
    function ( socket ) {
        socket.on(
            'message',
            function ( msg ) {
//                console.log( 'Received:' + msg + '\n' + 'From IP:' + socket.upgradeReq.connection.remoteAddress );
                if ( 'Hello' === msg )
                    socket.send( 'Websockets!' );
            }
        );
        socket.on(
            'close',
            function ( code, desc ) {
                console.log( 'Disconnect:', code, ' - ', desc );
            }
        );
    }
);
