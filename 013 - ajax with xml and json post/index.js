
const http     = require( 'http' );
const fs       = require( 'fs' );
const path     = require( 'path' );
const xml2js   = require( 'xml2js' );

const profiles = require( './profiles' );


const index = fs.readFileSync( 'index.html' );
const clientXml2js = fs.readFileSync( 'xml2js.js' );

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
    },
    'xml2js': function( ext ) {
        if ( 'js' === ext )
            return clientXml2js;
    }
}
const mimes = {
    xml : 'application/xml',
    json: 'application/json',
    js  : 'application/javascript'
};

function updateProfiles( profile, type, cb ) {
    let name = Object.keys( profile ).pop();
    profiles[ name ] = profile[ name ];
    cb( output( profiles[ name ], type, name ) );
}

function addProfile( req, cb ) {
    let pD = '';
    req.on( 
        'data',
        chunk => {
            pD += chunk;
        }
    ).on(
        'end',
        () => {
            let contentType = req.headers[ 'content-type' ];

            if ( 'application/json' === contentType )
                updateProfiles( JSON.parse( pD ), 'json', cb );

            if ( 'application/xml' === contentType )
                xml2js.parseString(
                    pD,
                    {
                        explicitRoot: false,
                        explicitArray: false
                    },
                    ( err, obj ) => {
                        updateProfiles( obj, 'xml', cb );
                    }
                );
        }
    );
}

http.createServer(
    ( req, resp ) => {
        let dirname = path.dirname( req.url ), extname = path.extname( req.url ),
            basename = path.basename( req.url, extname );
    
        if ( 'POST' === req.method ) {
            addProfile(
                req,
                output => {
                    resp.end( output );
                }
            );
            return;
        }

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
