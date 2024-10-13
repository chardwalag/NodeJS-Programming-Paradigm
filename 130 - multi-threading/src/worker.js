const { parentPort, workerData } = require( 'worker_threads' ),

sum = N => N.reduce(( acc, num ) => acc + num, 0 ),
result = sum( workerData )
parentPort.postMessage( result )