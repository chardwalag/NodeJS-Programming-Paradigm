
var static = require( 'node-static' );

staticServe = dir => new ( static.Server )( 'sites/' + dir );

exports.sites = {
    'nodecookbook': staticServe( 'testing' ),
    'localhost': staticServe( 'localhost-site' )
};
