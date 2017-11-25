
var cradle = require( 'cradle' );
var db = new( cradle.Connection )().database( 'quotes' );
var params = { author: process.argv[ 2 ], quote: process.argv[ 3 ] };

errorHandler = err => {
    if ( err ) { console.log( err ); process.exit() }
}

db.exists(
    ( err, exists ) => {
        errorHandler( err );
        if ( !exists ) { db.create( checkAndSave ); return; }
        checkAndSave();
    }
);

checkAndSave = err => {
    errorHandler( err );
    if ( params.author && params.quote ) {
        db.save( { author: params.author, quote: params.quote }, outputQuotes );
        return;
    }
    outputQuotes();
}

createQuotesView = err => {
    errorHandler( err );
    db.save(
        '_design/quotes',
        { views: { byAuthor: { map: 'function (doc) { emit( doc.author, doc ) }' } } },
        outputQuotes
    );
}

outputQuotes = err => {
    errorHandler( err );
    if ( params.author ) {
        db.view(
            'quotes/byAuthor', { key: params.author },
            ( err, rowsArray ) => {
                if ( err && err.error === 'not_found' ) {
                    createQuotesView();
                    return;
                }
                errorHandler( err );
                rowsArray.forEach( doc => console.log( '%s: %s \n', doc.author, doc.quote ) );
            }
        );
    }
}

