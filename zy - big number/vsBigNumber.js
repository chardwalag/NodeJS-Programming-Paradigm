
const BigNumber = require( 'bignumber.js' );

const MyAlgo = require( './myBigAlgo' );


const len = 100000;

const aStr = MyAlgo.getRandomNumber( len );
const bStr = MyAlgo.getRandomNumber( len );

const a = new BigNumber( aStr );
const b = new BigNumber( bStr );
startTime = new Date();
const c = a.mul( b );
let timeDiff = new Date() - startTime;
MyAlgo.printProductBenchmark( aStr, bStr, c, timeDiff, 'BigNumber' );

startTime = new Date();
const d = MyAlgo.mult( aStr, bStr );
timeDiff = new Date() - startTime;
MyAlgo.printProductBenchmark( aStr, bStr, d, timeDiff, 'My BigNumber' );
