
var cradle = require( 'cradle' );
var db = new ( cradle.Connection )(
    { auth: { username: 'chard', password: 'chard' } }
).database( 'quotes' );

var admin_lock = ( newDoc, savedDoc, userCtx ) => {
    if ( userCtx.roles.indexOf( '_admin' ) === -1 )
        throw( { unauthorized: 'Only for admin users' } );
}

db.save( '_design/_auth', { views: {}, validate_doc_update: admin_lock.toString() }  );


