
var stream = require( 'stream' );
var util = require( 'util' );

StreamToArray = function( store ) {
    stream.Writable.call( this );
    this.store = store || [];
}

util.inherits( StreamToArray, stream.Writable );

StreamToArray.prototype._write = function( chunk, encoding, callback ) {
    this.store.push( chunk );
    callback();
}

module.exports = StreamToArray;
