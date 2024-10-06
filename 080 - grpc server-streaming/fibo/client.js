const grpc = require( '@grpc/grpc-js' ),

{ FiboRequest } = require( './proto/fibo_pb' ),
{ FiboClient } = require( './proto/fibo_grpc_pb' ),
{ addr } = require( '../config' ),


val = 10,

doFibo = client => {
console.log( 'doFibo called..' )
  const req = new FiboRequest().setNum( val ), fiboStream = client.fibo( req )
  fiboStream.on( 'data', res => console.log( res.getResult()))
  fiboStream.on( 'end', () => client.close())
},

main = () => {
  const creds = grpc.ChannelCredentials.createInsecure(), client = new FiboClient( addr, creds )
  doFibo( client )
}

main()