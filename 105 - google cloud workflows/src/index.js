const { ExecutionsClient  } = require( '@google-cloud/workflows' ),
path = require( 'path' ),


keyFilePath = path.join( __dirname, '../service-account-file.json' ),
exeClient = new ExecutionsClient({ keyFilename: keyFilePath }),

projectId = 'PROJECT_ID',
location = 'asia-southeast2',
workflow = 'fetchWeatherAndStore',
city = 'Manila',
apiKey = 'WHEATHE_APIKEY',

run = async () => {
  const parent = exeClient.workflowPath( projectId, location, workflow ),
  request = { parent, execution: { argument: JSON.stringify({ city, apiKey })}}

  try {
    const [ exeResponse ] = await exeClient.createExecution( request )
    console.log( `Execution started: ${ exeResponse.name }` )
  }
  catch ( err ) {
    console.error( `Error executing workflow: ${ err.message }` )
  }
}

run().catch( console.error )