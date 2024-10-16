require( 'dotenv' ).config()

const express = require( 'express' ),
paypal = require( 'paypal-rest-sdk' ),
cors = require( 'cors' ),
bodyParser = require( 'body-parser' ),


app = express(),
PORT = process.env.PORT || 5000;

app.use( cors())
app.use( bodyParser.json())
app.use( express.static( 'public' ))

paypal.configure({
  'mode': 'sandbox',
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_CLIENT_SECRET
})

app.post( '/api/payment', ( req, res ) => {
  const create_payment_json = {
    "intent": "sale",
    "payer": { "payment_method": "paypal" },
    "redirect_urls": {
      "return_url": "http://localhost:3000/success",
      "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
      "amount": { "currency": "USD", "total": req.body.amount },
      "description": req.body.description
    }]
  }

  paypal.payment.create(
    create_payment_json,
    ( err, payment ) => {
      if ( err ) {
        console.error( err )
        res.status( 500 ).send( err )
      } else {
        for ( let link of payment.links ) {
          if ( link.rel === 'approval_url' )
            res.json({ approvalUrl: link.href })
        }
        // for ( let i = 0; i < payment.links.length; i++ ) {
        //     if (payment.links[i].rel === 'approval_url') {
        //         res.json({ approvalUrl: payment.links[i].href });
        //     }
        // }
      }
    }
  )
})

app.get( '/success', ( req, res) => { res.send( 'Payment completed successfully!' )})

app.get( '/cancel', ( req, res ) => { res.send( 'Payment cancelled.' )})

app.listen( PORT, () => { console.log( `Server is running on http://localhost:${ PORT }` )})