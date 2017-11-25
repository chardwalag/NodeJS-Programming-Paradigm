
const http = require( 'http' );


const urlOpts = {
    host  : 'localhost',
    path  : '/',
    port  : '8080',
    method: 'POST'
};

let req = http.request(
    urlOpts,
    resp => {
        resp.on(
            'data',
            chunk => {
                console.log( 'data:', chunk.toString() );
            }
        );
    }
).on(
    'error',
    e => {
        console.log( 'error:' + e.stack );
    }
);

process.argv.forEach(
    ( postItem, index ) => {
        if ( index > 1 )
            req.write( postItem + '\n' );
    }
);
req.end();
