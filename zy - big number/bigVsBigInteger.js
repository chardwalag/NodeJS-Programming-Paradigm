
const Big = require( 'big.js' );
const BigNumber = require( './node_modules/biginteger.js/lib/bignumber' ).BigNumber;

const MyAlgo = require( './myBigAlgo' );


const len = 10000;
Big.DP = 0;
const newLen = Big.PE = 2 * len + 5;

const aStr = MyAlgo.getRandomNumber( len );
const a = new Big( aStr );

const bStr = MyAlgo.getRandomNumber( len );
const b = new Big( bStr );

let startTime = new Date();
const c = a.mul( b );
let timeDiff = new Date() - startTime;
MyAlgo.printProductBenchmark( aStr, bStr, c, timeDiff, 'Big' );

BigNumber.changeDefaultSize( newLen );
const d = new BigNumber( aStr );
const e = new BigNumber( bStr );
startTime = new Date();
const f = d.multiply( e );
timeDiff = new Date() - startTime;
MyAlgo.printProductBenchmark( aStr, bStr, f, timeDiff, 'BigInteger' );
