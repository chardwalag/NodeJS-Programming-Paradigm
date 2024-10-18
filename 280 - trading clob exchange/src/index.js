const express = require( 'express' ),
bodyParser = require( 'body-parser' ),
cors = require( 'cors' ),
path = require( 'path' ),


app = express(),
PORT = process.env.PORT || 3000,

matchOrders = () => {
  while ( orderBook.buy.length > 0 && orderBook.sell.length > 0 ) {
    const bestBuy = orderBook.buy[ 0 ], bestSell = orderBook.sell[ 0 ]

    if ( bestBuy.price >= bestSell.price ) {
      const tradeQuantity = Math.min( bestBuy.quantity, bestSell.quantity )
      console.log( `Trade executed: ${ tradeQuantity } at price ${ bestSell.price }` )

      bestBuy.quantity -= tradeQuantity
      bestSell.quantity -= tradeQuantity

      if ( bestBuy.quantity === 0 ) orderBook.buy.shift()
      if ( bestSell.quantity === 0 ) orderBook.sell.shift()
    }
    else break
  }
}

app.use( cors())
app.use( bodyParser.json())
app.use( express.static( path.join(  __dirname, '../public' )))

let orderBook = {
  buy: [
      { price: 100, quantity: 5 },
      { price: 98, quantity: 10 },
      { price: 97, quantity: 2 }
  ],
  sell: [
      { price: 101, quantity: 3 },
      { price: 102, quantity: 7 },
      { price: 105, quantity: 1 }
  ]
}

app.post( '/order', ( req, res ) => {
  const { type, price, quantity } = req.body

  if ( type === 'buy' ) {
    orderBook.buy.push({ price, quantity })
    orderBook.buy.sort(( a, b ) => b.price - a.price)
  } else if ( type === 'sell' ) {
    orderBook.sell.push({ price, quantity })
    orderBook.sell.sort(( a, b ) => a.price - b.price )
  }
  matchOrders()
  res.json({ message: 'Order placed successfully', orderBook })
});

app.get( '/orderbook', ( req, res) => { res.json(orderBook)})

app.listen( PORT, () => { console.log( `Server is running on port ${ PORT }` )})