
const http = require( 'http' );
const fs   = require( 'fs' );


let boundary = Date.now();
const urlOpts = {
    host   : 'localhost',
    path   : '/',
    port   : '8080',
    method : 'POST',
    headers: { 'Content-Type': 'multipart/form-data; boundary="' + boundary + '"' }
};
boundary = '--' + boundary;

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

(
    function multipartAssembler( files ) {
        let f = files.shift(), fSize = fs.statSync( f ).size, progress = 0;

        fs.createReadStream( f ).once(
            'open',
            () => {
                req.write(
                    boundary + '\r\n' +
                    'Content-Disposition: ' +
                    'form-data; name="userfile"; filename="' + f + '"\r\n' +
                    'Content-Type: application/octet-stream\r\n' +
                    'Content-Transfer-Encoding: binary\r\n\r\n'
                );
            }
        ).on(
            'data',
            chunk => {
                req.write( chunk );
                progress += chunk.length;
                console.log( f + ': ' + Math.round( ( progress / fSize ) * 10000 / 100 ) + '%' );
            }
        ).on(
            'end',
            () => {
                if ( files.length ) {
                    multipartAssembler( files );
                    return;
                }
                req.end( '\r\n' + boundary + '--\r\n\r\n\r\n' );
            }
        );
    }
)( process.argv.splice( 2, process.argv.length ) );
