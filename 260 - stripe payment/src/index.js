require( 'dotenv' ).config()

const express = require( 'express' )
bodyParser = require( 'body-parser' )
stripe = require( 'stripe' )( process.env.STRIPE_SECRET_KEY ),


app = express(),
PORT = process.env.PORT || 3000

app.use( bodyParser.json())
app.use( express.static( 'public'))

app.post( '/create-checkout-session', async ( req, res ) => {
  const { items } = req.body,
  session = await stripe.checkout.sessions.create({
    payment_method_types: [ 'card' ],
    line_items: items.map( item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${ req.headers.origin }/success.html`,
    cancel_url: `${ req.headers.origin }/cancel.html`,
  })
  res.json({ id: session.id })
})

app.listen( PORT, () => console.log( `Server running on port ${ PORT }` ))