
const http     = require( 'http' );
const fs       = require( 'fs' );
const path     = require( 'path' );
const xml2js   = require( 'xml2js' );

const profiles = require( './profiles' );


const index = fs.readFileSync( 'index.html' );

function output( content, format, rootNode ) {
    if ( !format || 'json' === format )
        return JSON.stringify( content );

    if ( 'xml' === format )
        return (
            new xml2js.Builder( { rootName: rootNode } )
        ).buildObject( content );
}

const routes = {
    'profiles': function( format ) {
        return output( Object.keys( profiles ), format );
    },
    '/profile': function( format, basename ) {
        return output( profiles[ basename ], format, basename );
    }
}
const mimes = { xml: 'application/xml', json: 'application/json' };

http.createServer(
    ( req, resp ) => {
        let dirname = path.dirname( req.url ), extname = path.extname( req.url ),
            basename = path.basename( req.url, extname );
    
        extname = extname.replace( '.', '' );
        resp.setHeader( 'Content-Type', mimes[ extname ] || 'text/html' );

        if ( routes.hasOwnProperty( dirname ) ) {
            resp.end( routes[ dirname ]( extname, basename ) );
            return;
        }

        if ( routes.hasOwnProperty( basename ) ) {
            resp.end( routes[ basename ]( extname ) );
            return;
        }

        resp.end( index );
    }
).listen( 8080 );
