
var client = require( 'mongodb' ).MongoClient, profiles = require( './profiles' ),
    users = [ { name: 'name', pwd: 'password' }, { name: 'MrPage', pwd: 'page' } ],
    tx = 2;

profiles = Object.keys( profiles ).map( key => profiles[ key ] );

e = err => {
    if ( !err ) return;
    console.log( err );
    process.exit();
}

tidy = db => --tx || db.close()

client.connect(
    'mongodb://localhost:27017/profiler',
    ( err, db ) => {
        e( err );
        db.dropDatabase(
            err => {
                e( err );
                db.collection( 'profiles' ).insert(
                    profiles,
                    ( err, o ) => {
                        e( err );
                        console.log( 'Added profiles' );
                        tidy( db );
                    }
                );
            }
        )
    }
);
