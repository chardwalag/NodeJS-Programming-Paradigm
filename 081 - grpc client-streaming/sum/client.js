const grpc = require( '@grpc/grpc-js' ),

{ SumRequest } = require( './proto/sum_pb' ),
{ SumClient } = require( './proto/sum_grpc_pb' ),
{ addr } = require( '../config' ),


vals = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],

doSum = client => {
console.log( 'doSum called..' )
  const call = client.sum(( err, res ) => {
    if ( err ) return console.error( err )
    console.log( `Total sum: ${ res.getResult()}` )
  })

  vals.forEach( val => {
    const req = new SumRequest().setNum( val )
    call.write( req )
  })
  call.end();
},

main = () => {
  const creds = grpc.ChannelCredentials.createInsecure(), client = new SumClient( addr, creds )
  doSum( client )
}

main()