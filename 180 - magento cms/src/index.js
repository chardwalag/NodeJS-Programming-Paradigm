require( 'dotenv' ).config()

const express = require( 'express' ),
Magento = require( 'magento-api-rest' ).default,


app = express(),
PORT = process.env.PORT || 3000,

client = new Magento({
  url: process.env.STORE_URL,
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESSTOKEN,
  tokenSecret: process.env.TOKEN_SECRET
})

let products = [];

app.use( express.json())

app.get( '/products', ( req, res ) => { res.json( products )})

app.get( '/product/:sku', ( req, res ) => {
  const product = products.find( p => p.sku === req.params.sku )
  if ( product ) res.json( product )
  else res.status( 404 ).json({ message: 'Product not found' })
})

app.post( '/create-product', async ( req, res ) => {
  const newProduct = {
    sku: req.body.sku,
    name: req.body.name,
    price: req.body.price,
    status: req.body.status,
    type_id: req.body.type_id,
    attribute_set_id: req.body.attribute_set_id,
    weight: req.body.weight,
    visibility: req.body.visibility,
    custom_attributes: req.body.custom_attributes
  };

  products.push( newProduct )

  try {
    const magentoResponse = await client.post( 'products', newProduct )
    res.status( 201 ).json({ message: 'Product created in memory and Magento', magentoResponse })
  } catch ( err ) {
    res.status( 500 ).json({ error: error.message })
  }
})

app.put( '/update-product/:sku', ( req, res ) => {
  const index = products.findIndex( p => p.sku === req.params.sku )
  if ( index === -1 ) res.status( 404 ).json({ message: 'Product not found' })
  else {
    products[ index ] = { ...products[index], ...req.body }
    res.json( products[ index ])
  }
})

app.delete( '/delete-product/:sku', ( req, res ) => {
  const index = products.findIndex( p => p.sku === req.params.sku )
  if ( index === -1 ) res.status( 404 ).json({ message: 'Product not found' })
  else {
    products.splice( index, 1 )
    res.status( 204 ).send()
  }
})

app.listen( PORT, () => { console.log( `Server is running on http://localhost:${ port }` )})