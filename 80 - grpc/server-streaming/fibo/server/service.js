const { FiboResponse } = require( '../proto/fibo_pb' ),


delay = () => new Promise( res => setTimeout( res, 1000 )),

fibo = async ( call ) => {
  let val1 = 0, val2 = 1, n = call.request.getNum(), res = new FiboResponse()
console.log( `Fibo call.. n = ${ n }` )

  res.setResult( `Fibo(1): ${ val1 }` ), call.write( res ), await delay()
  res.setResult( `Fibo(2): ${ val2 }` ), call.write( res ), await delay()

  for ( let i = 2, newval; i < n; ++i ) {
    newval = val1 + val2, val1 = val2, val2 = newval
    res.setResult( `Fibo(${ 1 + i }): ${ newval }` ), call.write( res ), await delay()
  }
  call.end()
}


module.exports = { fibo }