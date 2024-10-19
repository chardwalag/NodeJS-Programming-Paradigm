require( 'dotenv' ).config()

const express = require( 'express' ),
mongoose = require( 'mongoose' ),
axios = require( 'axios' ).default,
bodyParser = require( 'body-parser' ),


app = express(),
PORT = process.env.PORT || 3000,
SYMBOLS_URL = `https://api.stockdata.org/v1/data/symbols?api_token=${ process.env.STOCKDATA_API_TOKEN }`,
PLACE_ORDER_URL = 'https://api.stockdata.org/v1/data/eod?symbols=',

orderSchema = new mongoose.Schema({
  stockSymbol: String,
  quantity: Number,
  price: Number,
  date: { type: Date, default: Date.now }
}),

Order = mongoose.model( 'Order', orderSchema )

app.use( bodyParser.urlencoded({ extended: true }))
app.use( express.json())
app.use( express.static( 'public' ))

mongoose.connect( process.env.MONGODB_URI )
  .then(() => console.log( "MongoDB connected" ))
  .catch( err => console.error( "MongoDB connection error:", err ))

app.get( '/', ( req, res) => { res.sendFile( __dirname + '/public/index.html' )})

app.get( '/symbols', async ( req, res ) => {
  try {
    const response = await axios.get( SYMBOLS_URL )
    const symbols = response.data.data
    res.json( symbols )
  } catch ( err ) {
    console.error( err )
    res.status( 500 ).send( 'Error fetching stock symbols.' )
  }
})

app.post( '/place-order', async ( req, res ) => {
  const { stockSymbol, quantity } = req.body;
  try {
    const response = await axios.get( `${ PLACE_ORDER_URL }${ stockSymbol }&api_token=${ process.env.STOCKDATA_API_TOKEN }` ),
    stockData = response.data;

    if ( stockData.data.length === 0 ) return res.status( 404 ).send( 'Stock not found.' )

    const currentPrice = stockData.data[ 0 ].close,
    order = new Order({ stockSymbol, quantity, price: currentPrice })
    await order.save()
    res.json({ message: 'Order placed successfully!', order })
  } catch ( err ) {
    console.error( err )
    res.status( 500 ).send( 'Error placing order.' )
  }
})

app.get( '/orders', async ( req, res ) => {
  try {
    const orders = await Order.find()
    res.json( orders )
  } catch ( err ) {
    console.error( err )
    res.status( 500 ).send( 'Error fetching orders.' )
  }
})

app.listen( PORT, () => { console.log( `Server is running on http://localhost:${ PORT }` )})