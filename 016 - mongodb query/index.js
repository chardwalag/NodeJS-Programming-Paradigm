
var client = require( 'mongodb' ).MongoClient,
    params = { author: process.argv[ 2 ], quote: process.argv[ 3 ] };

client.connect(
    'mongodb://localhost:27017/quotes',
    function ( err, db ) {
        if ( err ) { throw err; }

        var collection = db.collection( 'quotes' );

        if ( params.author && params.quote ) {
            collection.insert(
                { author: params.author, quote: params.quote },
                function ( err ) {
                    if ( err ) { throw err; }
                }
            )
        }

        if ( params.author ) {
            collection.find( { author: params.author } )
                .each(
                    function ( err, doc ) {
                        if ( err ) { throw err; }
                        if ( doc ) {
                            console.log( '%s: %s \n', doc.author, doc.quote );
                            return;
                        }
                        db.close();
                    }
                );
        }
        collection.ensureIndex(
            'author', //{ safe: true },
            function ( err ) {
                if ( err ) { throw err; }
                collection.distinct(
                    'author',
                    function ( err, result ) {
                        if ( err ) { throw err; }
                        console.log( result.join( '\n' ) );
                        db.close();
                    }
                );
            }
        );
//        db.close();
    }
);
