const { IncrementResponse } = require( '../proto/increment_pb' ),


increment = stream => {
console.log( `increment called..` )
  const inc = 10

  stream.on( 'data', req => {
    const res = new IncrementResponse().setResult( inc + req.getNum())
    stream.write( res )
  })
  stream.on( 'end', () => stream.end())
}


module.exports = { increment }