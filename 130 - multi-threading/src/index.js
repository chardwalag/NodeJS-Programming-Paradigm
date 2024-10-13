const { Worker } = require( 'worker_threads' ),


runWorker = data => new Promise(( res, rej ) => {
  const worker = new Worker( './src/worker.js', { workerData: data })
  console.log( data )
  worker.on( 'message', res )
  worker.on( 'error', rej )
  worker.on( 'exit', code => { if ( code ) rej( new Error( `Worker error exit code ${ code }` ))})
})

run = async () => {
  const largeArray = Array.from({ length: 1_000_000 }, (_, i ) => i + 1 ),
  chunkSize = Math.ceil( largeArray.length / 4 ), tasks = [];

  // partition task to 4 workers
  for ( let i = 0; i < 4; i++ ) {
    const chunk = largeArray.slice( i * chunkSize, ( i + 1 ) * chunkSize )
    tasks.push( runWorker( chunk ))
  }

  try {
      const results = await Promise.all( tasks ),
      sum = results.reduce(( acc, num ) => acc + num, 0 )
      console.log( `Sum: ${ sum }` )
  } catch ( err ) {
    console.error( err )
  }
}

run()