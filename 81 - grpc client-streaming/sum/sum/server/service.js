const { SumResponse } = require( '../proto/sum_pb' ),


sum = ( stream, cb ) => {
console.log( `Sum called..` )
  let sum = 0

  stream.on( 'data', req => sum += req.getNum())
  stream.on( 'end', () => {
    const res = new SumResponse().setResult( sum )
    cb( null, res )
  })
}


module.exports = { sum }