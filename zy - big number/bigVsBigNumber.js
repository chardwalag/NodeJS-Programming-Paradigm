
const Big = require( 'big.js' );
const BigNumber = require( 'bignumber.js' );

const MyAlgo = require( './myBigAlgo' );


const len = 10000;

const aStr = MyAlgo.getRandomNumber( len );
const bStr = MyAlgo.getRandomNumber( len );

const a = new Big( aStr );
const b = new Big( bStr );

let startTime = new Date();
const c = a.mul( b );
let timeDiff = new Date() - startTime;
MyAlgo.printProductBenchmark( aStr, bStr, c, timeDiff, 'Big' );

const d = new BigNumber( aStr );
const e = new BigNumber( bStr );
startTime = new Date();
const f = d.mul( e );
timeDiff = new Date() - startTime;
MyAlgo.printProductBenchmark( aStr, bStr, f, timeDiff, 'BigNumber' );
