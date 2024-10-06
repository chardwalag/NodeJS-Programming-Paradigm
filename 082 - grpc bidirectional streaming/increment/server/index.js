const grpc = require( '@grpc/grpc-js' ),

service = require( '../proto/increment_grpc_pb' ),
serviceImpl = require( './service' ),
{ addr } = require( '../../config' ),


cleanup = () => {
  if ( server ) {
console.log( 'Server cleanup..' )
    server.forceShutdown()
  }
},

main = () => {
  server = new grpc.Server()
  const creds = grpc.ServerCredentials.createInsecure()
  server.addService( service.IncrementService, serviceImpl )
  server.bindAsync( addr, creds, err => {
    if ( err ) return cleanup( server )
  });

console.log( `Server listening on: ${ addr }` )
}

let server

process.on( 'SIGINT', () => {
console.log( 'Shutdown by admin.' )
  if ( server ) cleanup()
})

main()