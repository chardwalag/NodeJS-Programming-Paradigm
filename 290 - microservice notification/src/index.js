require( 'dotenv' ).config()

const express = require( 'express' ),
amqp = require( 'amqplib' ),
path = require( 'path' ),


RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost',
QUEUE_NAME = process.env.QUEUE_NAME || 'notifications',
PORT = process.env.PORT || 3000

app = express()
app.use( express.json())
app.use( express.static(path.join( __dirname, '../public' )))

app.post( '/notify', async ( req, res ) => {
  const { message } = req.body
  try {
    const connection = await amqp.connect( RABBITMQ_URL ),
    channel = await connection.createChannel()
    await channel.assertQueue( QUEUE_NAME, { durable: false })
    
    channel.sendToQueue( QUEUE_NAME, Buffer.from( message ))
    console.log( `Sent: ${ message }` )
    
    res.status( 200 ).send( 'Notification queued' )
    
    setTimeout(() => { connection.close() }, 500 )
  } catch ( err ) {
    console.error( err )
    res.status( 500 ).send( 'Error sending notification' )
  }
})

app.listen( PORT, () => { console.log( `Server is running on port ${ PORT }` )})