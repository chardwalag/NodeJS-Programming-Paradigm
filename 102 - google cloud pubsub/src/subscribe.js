const { PubSub } = require( '@google-cloud/pubsub' ),
path = require( 'path' ),


keyFilePath = path.join( __dirname, '../service-account-file.json' ),
pubSubClient = new PubSub({ keyFilename: keyFilePath }),
subscriptionName = 'subscription-101'

listenForMessages = async () => {
  const subscription = pubSubClient.subscription( subscriptionName ),
  messageHandler = msg => {
    console.log( `Received message: ${ msg.id }` )
    console.log( `Data: ${ msg.data.toString()}` )
    msg.ack()
  }

  subscription.on( 'message', messageHandler )
}

listenForMessages()