
var client = require( 'mongodb' ).MongoClient, users;

client.connect(
    'mongodb://localhost:27017/profiler',
    ( err, db ) => users = db.collection( 'users' )
);

validate = ( user, cb ) => {
    if ( !users ) { cb( { msg: 'User data not ready' } ); }
    users.findOne(
        { name: user.name, pwd: user.pwd },
        ( err, user ) => {
            if ( err ) throw err;
            if ( !user ) {
                cb( { msg: 'Invalid login details' } );
                return;
            }
            cb();
        }

    );
}

module.exports = function( req, res, next ) {
    var method = req.method.toLowerCase(),
        logout = (  req.body[ '_method' ] === 'DELETE' ),
        login = req.body.username && method === 'post';

    if ( logout ) { delete req.session.user; }

    if ( login ) {
        validate(
            req.body,
            function( err ) {
                if ( err ) {
                    req.flash( 'error', err.msg );
                    return next();
                }
                res.locals.user = req.session.user;
                next();
            }
        );
        return;
    }
    if ( !req.session.user ) { return next(); }
    res.locals.user = req.session.user;
    next();
}
