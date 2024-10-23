require( 'dotenv' ).config()

const express = require( 'express' ),
mongoose = require( 'mongoose' ),
cors = require( 'cors' ),
Product = require( './models/product.model' ),


app = express(),
PORT = process.env.PORT || 3000,

populateDatabase = async () => {
  const sampleProducts = [
    { title: 'Prod1', description: 'Description for Product 1', price: 1.99, rating: 4.5 },
    { title: 'Prod2', description: 'Description for Product 2', price: 2.99, rating: 4.0 },
    { title: 'Prod3', description: 'Description for Product 3', price: 3.99, rating: 3.5 },
    { title: 'Prod4', description: 'Description for Product 4', price: 4.99, rating: 5.0 },
    { title: 'Prod5', description: 'Description for Product 5', price: 5.99, rating: 4.8 },
  ];
  await Product.deleteMany({})
  await Product.insertMany( sampleProducts )
  console.log( 'Database seeded with sample products.' )
}

app.use( cors())
app.use( express.json())
app.use( express.static( 'public' ))

mongoose.connect( process.env.MONGO_URI )
  .then(() => {
    console.log( 'MongoDB connected' )
    populateDatabase()
  })
  .catch( err => console.error( 'MongoDB connection error:', err ))

app.post( '/products', async ( req, res ) => {
  try {
    const product = new Product( req.body )
    await product.save()
    res.status( 201 ).send( product )
  } catch ( err ) {
    res.status( 400 ).send( err )
  }
})

app.get( '/products', async ( req, res ) => {
  const { rating } = req.query
  try {
    const query = rating ? await Product.findByRating( rating ) : await Product.find()
    res.send( query )
  } catch ( error ) {
    res.status( 500 ).send( err )
  }
})

app.patch( '/products/:id', async ( req, res ) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate( req.params.id, req.body, { new: true })
    if ( !updatedProduct ) return res.status( 404 ).send({ message: 'Product not found' })
    res.send( updatedProduct )
  } catch ( err ) {
    res.status( 400 ).send( err )
  }
})

app.delete( '/products/:id', async ( req, res ) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete( req.params.id )
    if ( !deletedProduct ) return res.status( 404 ).send({ message: 'Product not found' })
    res.send({ message: 'Product deleted successfully' })
  } catch ( err ) {
    res.status( 500 ).send( err )
  }
})

app.listen( PORT, () => { console.log( `Server is running on port ${ PORT }` )})