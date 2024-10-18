const express = require( 'express' ),
cors = require( 'cors' ),
bodyParser = require( 'body-parser' ),
{ calculateTradingSignals, generateRandomPrices } = require( './data' ),


app = express(),
PORT = 3000

app.use( cors())
app.use( bodyParser.json())
app.use( express.static( 'public' ))

app.get( '/api/trading-signals', ( req, res ) => {
  const historicalPrices = generateRandomPrices( 30 ), // Generate 30 days of random prices
  signals = calculateTradingSignals( historicalPrices )
  res.json( signals )
})

app.listen( PORT, () => { console.log( `Server is running on http://localhost:${ PORT }` )})