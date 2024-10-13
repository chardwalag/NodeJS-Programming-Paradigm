const { PubSub } = require( '@google-cloud/pubsub' ),
path = require( 'path' ),


keyFilePath = path.join( __dirname, '../service-account-file.json' ),
pubSubClient = new PubSub({ keyFilename: keyFilePath }),
topicName = 'topic-101',

publishMessage = async ( msg ) => {
  const dataBuffer = Buffer.from( JSON.stringify( msg ))

  try {
    const msgId = await pubSubClient.topic( topicName ).publish( dataBuffer )
    console.log( `Message ${ msgId } published.` )
  } catch ( err ) {
    console.error( `Error publishing message: ${ err.message }` );
  }
}

publishMessage({ userId: '12345', action: 'create' })