
var StreamToArray = require( './to_array' ),
    StreamFromArray = require( './from_array' ),
    store = [],
    writable = new StreamToArray( store ),
    readable = new StreamFromArray( store );

writable.write( 'fee' );
writable.write( 'fi' );
writable.write( 'fo' );
writable.write( 'fum' );

readable.on( 'data', data => console.log( data + '' ) );
