const QRCode = require( 'qrcode' ),
path = require( 'path' ),
fs = require( 'fs' ),


getUrlName = url => url.split( '//' )[ 1 ],

url = 'https://www.salesforce.com',
outFolderName = 'output',
outFilename = `${ getUrlName( url )}_qrcode.png`
outputDir = path.join( __dirname, outFolderName ),
outputFile = path.join( outputDir, outFilename ),

options = {
  errorCorrectionLevel: 'H',
  type: 'image/png',
  quality: 0.92,
  margin: 1,
  color: {
    dark: '#000000', // Dark color foreground
    light: '#FFFFFF' // Light color background
  },
}

if ( !fs.existsSync( outputDir )) fs.mkdirSync( outputDir )

QRCode.toFile( outputFile, url, options, ( err ) => {
  if ( err ) throw err
  console.log( `Image QR code is saved at ${ outputFile }\n` )
})

QRCode.toString( url, { type: 'terminal' }, function ( err, qr ) {
  console.log( getUrlName( url ), 'QR code' )
  console.log( qr )
})

QRCode.toDataURL( url, options ).then( url => {
  console.log( `${ url }\n` )
})
.catch( err => {
  console.error( err )
})