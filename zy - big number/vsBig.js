
let Big = require( 'big.js' );

let MyAlgo = require( './myBigAlgo' );


let len = 10000;
Big.DP = 0;
Big.PE = 2 * len + 1;
let a = new Big( MyAlgo.getRandomNumber( len ) );
let b = new Big( MyAlgo.getRandomNumber( len ) );

let startTime = new Date();
let c = a.mul( b );
let timeDiff = new Date() - startTime;

console.log( '\n---------------------------------------\n' );
console.log( a.toString() );
console.log( 'x\n' + b.toString() );
console.log( '=\n' + c.toString() );
console.log( 'elapsed time: ' + MyAlgo.elapsedTimeToStr( timeDiff ) );
console.log( '\n---------------------------------------\n' );

