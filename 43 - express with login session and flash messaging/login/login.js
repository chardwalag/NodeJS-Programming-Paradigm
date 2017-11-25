
var users = { 'name': 'password' };

module.exports = function( req, res, next ) {
    var method = req.method.toLowerCase(),
        logout = (  req.body[ '_method' ] === 'DELETE' ),
        login = req.body.username && method === 'post';

    if ( logout ) { delete req.session.user; }

    function validate( obj, cb ) {
        var valid = Object.keys( users ).some(
            function (name) {
                return ( obj.username === name && obj.userpwd === users[ name ] )
            }
        );
        cb( !valid && { msg: 'Login details invalid' } )
    }
    
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
