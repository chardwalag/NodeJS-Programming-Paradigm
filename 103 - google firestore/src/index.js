const { Firestore } = require( '@google-cloud/firestore' )
path = require( 'path' ),


keyFilePath = path.join( __dirname, '../service-account-file.json' ),
firestore = new Firestore({ keyFilename: keyFilePath }),
docName = 'x-product',

start = async () => {
  const usersCollection = firestore.collection( 'products' )

  await usersCollection.doc( docName ).set({ name: 'XYZ', brand: 'A', company: 'Alpha' })
  console.log( 'Product created.' )

  const userDoc = await usersCollection.doc( docName ).get()
  if ( userDoc.exists ) console.log( 'Product data:', userDoc.data())
  else console.log( 'No such document!' )

  await usersCollection.doc( docName ).update({ age: 10 })
  console.log( 'Product updated.' )

  await usersCollection.doc( docName ).delete()
  console.log( 'Product deleted.' )
}

start().catch( console.error )