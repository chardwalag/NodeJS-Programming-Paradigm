require( 'dotenv' ).config()

const amqp = require( 'amqplib' ),


RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost',
QUEUE_NAME = process.env.QUEUE_NAME || 'notifications',

processNotification = async ( msg ) => {
  console.log( `Processing notification: ${ msg.content.toString()}` )
},

startWorker = async () => {
  const connection = await amqp.connect( RABBITMQ_URL ),
  channel = await connection.createChannel()
  
  await channel.assertQueue( QUEUE_NAME, { durable: false })
  
  console.log( `Waiting for messages in ${ QUEUE_NAME }. To exit press CTRL+C` )
  
  channel.consume( QUEUE_NAME, async ( msg ) => {
    await processNotification( msg )
    channel.ack( msg )
  })
}

startWorker().catch( console.error )