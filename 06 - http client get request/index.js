
const http = require( 'http' );
const url  = require( 'url' );


let urlOpts = {
    host: 'www.nodejs.org',
    path: '/',
    port: '80'
}

if ( process.argv[ 2 ] ) {
    if ( !process.argv[ 2 ].match( 'http://' ) ) {
        process.argv[ 2 ] = 'http://'  + process.argv[ 2 ];
    }
    urlOpts = url.parse( process.argv[ 2 ] );
}

http.get(
    urlOpts,
    resp => {
        resp.on(
            'data',
            chunk => {
                console.log( 'XXXXX' );
                console.log( chunk.toString() );
            }
        )
    }
)
.on(
    'error',
    e => {
        console.log( 'error: ', e.message );
    }
);
