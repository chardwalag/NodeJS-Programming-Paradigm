require( 'dotenv' ).config()

const express = require( 'express' ),
bodyParser = require( 'body-parser' ),
twilio = require( 'twilio' ),


{ MessagingResponse } = twilio.twiml,
app = express(),
PORT = process.env.PORT || 3000

app.use( bodyParser.urlencoded({ extended: false }))
app.use( express.static( 'public' ))

let messages = []

app.post( '/send-sms', ( req, res ) => {
  const client = new twilio( process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN )
  client.messages.create({ body: req.body.message, to: req.body.to, from: process.env.TWILIO_PHONE_NUMBER })
  .then( msg => {
    console.log( `Message SID: ${ msg.sid }` )
    res.redirect( '/' )
  })
  .catch( err => {
    console.error( err )
    res.status( 500 ).send( 'Error sending message' )
  });
})

app.post( '/sms', ( req, res ) => {
  const twiml = new MessagingResponse(),
  incomingMessage = { from: req.body.From, body: req.body.Body, date: new Date().toISOString()}
  messages.push( incomingMessage )
  twiml.message( 'Received your message, thanks!' )
  res.type( 'text/xml' ).send( twiml.toString())
})

app.get( '/messages', ( req, res ) => { res.json( messages )});

app.listen( PORT, () => { console.log(`Express server listening on port ${ PORT }`)})