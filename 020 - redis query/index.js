
var redis = require( 'redis' ), client = redis.createClient(),
    params = { author: process.argv[ 2 ], quote: process.argv[ 3 ] };

if ( params.author && params.quote ) {
    var randKey = "Quotes:" + ( Math.random() * Math.random() ).toString( 16 ).replace( '.', '' );
    client.hmset( randKey, { 'author': params.author, 'quote': params.quote } );
    client.sadd( 'Author:' + params.author, randKey );
}

if ( params.author ) {
    client.smembers(
        'Author:' + params.author,
        ( err, keys ) => {
            keys.forEach(
                key => {
                    client.hgetall(
                        key,
                        ( err, hash ) => {
                            console.log( '%s: %s\n', hash.author, hash.quote );
                        }
                    );
                }
            );
            client.quit();
        }
    );
    return;
}
client.quit();

