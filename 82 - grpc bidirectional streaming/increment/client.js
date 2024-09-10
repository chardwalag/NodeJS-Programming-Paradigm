const grpc = require( '@grpc/grpc-js' ),

{ IncrementRequest } = require( './proto/increment_pb' ),
{ IncrementClient } = require( './proto/increment_grpc_pb' ),
{ addr } = require( '../config' ),


vals = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],

doIncrement = client => {
console.log( 'doIncrement called..' )
  const stream = client.increment()

  stream.on( 'data', res => {
    console.log( `Incremented result: ${ res.getResult()}` )
  })

  vals.forEach( val => {
    const req = new IncrementRequest().setNum( val )
    stream.write( req )
  })
  stream.end();
},

main = () => {
  const creds = grpc.ChannelCredentials.createInsecure(), client = new IncrementClient( addr, creds )
  doIncrement( client )
}

main()