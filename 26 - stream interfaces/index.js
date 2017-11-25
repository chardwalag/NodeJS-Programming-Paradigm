
var stream = require( 'stream' );
var writable = new stream.Writable();
var readable = new stream.Readable();
var store = [];

writable._write = ( chunk, encoding, callback ) => {
    store.push( chunk );
    callback();
}

readable._read = function( size, encoding ) {
    this.push( store.pop() || null );
}

writable.write( 'fee' );
writable.write( 'fi' );
writable.write( 'fo' );
writable.write( 'fum' );

readable.on( 'data', data => console.log( data + '' ) );
