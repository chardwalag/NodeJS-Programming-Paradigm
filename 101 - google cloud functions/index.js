const functions = require( '@google-cloud/functions-framework' )


functions.http(
  'pingPong',
  ( req, res) => {
    const message = req.query.message || req.body.message || ''
    if ( message.toLowerCase() === 'ping' ) res.send('pong')
    else res.status( 400 ).send( 'Send "ping" to receive "pong"' )
  }
)