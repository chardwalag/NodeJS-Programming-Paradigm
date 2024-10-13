const { Storage } = require( '@google-cloud/storage' ),
path = require( 'path' ),


keyFilePath = path.join( __dirname, '../service-account.json' ),
storage = new Storage({ keyFilename: keyFilePath }),
bucketName = 'test10101010101-bucket',
filename = 'uploadcontent.txt',

uploadFile = async () => {
  await storage.bucket( bucketName ).upload( `./${ filename }`, { destination: filename })
  console.log( `File uploaded to ${ bucketName }.` )
}

uploadFile().catch( console.error )