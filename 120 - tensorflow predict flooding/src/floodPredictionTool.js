const tf = require( '@tensorflow/tfjs-node' ),


FEATURE_COUNT = 3,

// Create LSTM (Long Short-Term Memory networks) model
createLSTMModel = () => {
  const model = tf.sequential()
  model.add( tf.layers.lstm({ units: 50, returnSequences: true, inputShape: [ 10, FEATURE_COUNT ]}))
  model.add( tf.layers.lstm({ units: 50 }))
  model.add( tf.layers.dense({ units: 1, activation: 'sigmoid' }))
  model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: [ 'accuracy' ]})
  return model;
},

generateDummyData = numSamples => {
  const xs = [], ys = []

  for ( let i = 0; i < numSamples; i++ ) {
    const sample = [];
    for ( let j = 0; j < 10; j++ ) {
      const rainfall = Math.random() * 100,     // Rainfall between 0 and 100 mm
      soilMoisture = Math.random() * 100,       // Soil moisture between 0% and 100%
      riverLevel = Math.random() * 10           // River level between 0 and 10 meters
      sample.push([ rainfall, soilMoisture, riverLevel ])
    }
        
    xs.push( sample )

    const avgRainfall = sample.reduce(( sum, s ) => sum + s[ 0 ], 0 ) / sample.length,
    avgSoilMoisture = sample.reduce(( sum, s ) => sum + s[ 1 ], 0 ) / sample.length

    // Flood risk determination
    if ( avgRainfall > 70 && avgSoilMoisture > 60 ) ys.push([ 1 ]) // High flood risk
    else ys.push([ 0 ]) // Low flood risk
  }

  return { xs: tf.tensor3d( xs ), ys: tf.tensor2d( ys )}
},

trainModel = async ( data ) => {
    const model = createLSTMModel()
    
    await model.fit(data.xs, data.ys, { epochs: 100 })
    console.log( "Model training done!" )
    
    return model
},

predictFloodRisk = async ( model, newData ) => {
  const inputTensor = tf.tensor3d([ newData ], [ 1, 10, FEATURE_COUNT ]),
  prediction = model.predict( inputTensor ),
  result = await prediction.data() // flood risk as output
  console.log( `Predicted flood risk (0 = no risk, 1 = high risk): ${ result[ 0 ]}` )
},

dummyData = generateDummyData( 100 )

trainModel( dummyData ).then( model => {
  console.log( "Model training complete!" )

  const newSample = []
  for ( let j = 0; j < 10; j++ ) {
    // features as input
    const rainfall = Math.random() * 100,
    soilMoisture = Math.random() * 100,
    riverLevel = Math.random() * 10
    newSample.push([ rainfall, soilMoisture, riverLevel ])
  }

  predictFloodRisk( model, newSample )
})