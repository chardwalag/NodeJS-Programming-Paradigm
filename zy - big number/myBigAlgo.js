
const BigNumber = require( 'bignumber.js' );


exports.getRandomNumber = n => {
    let i, m = 0, s = '';
    getNumber = () => {
        return Math.floor( Math.random() * 10 );
    }
    while ( 0 === m )
        m = getNumber();
    s += m;
    for ( i = 1; i < n; ++i )
        s += getNumber();
    return s;
}

exports.elapsedTimeToStr = elapsedTimeToStr = n => {
    let s = ''
    if ( n >= 1000 )
        s = ( n / 1000 ) + ' sec';
    else
        s = n + ' msec';
    return s;
}

exports.printProductBenchmark = ( a, b, c, t, v ) => {
    console.log( '\n---------------------------------------\n' );
//    console.log( a );
//    console.log( 'x\n' + b );
//    console.log( '=\n' + ( c.toFixed ? c.toFixed() : c.toString() ) );
    console.log( v + ' elapsed time: ' + elapsedTimeToStr( t ) );
    console.log( '\n---------------------------------------\n' );
}

exports.mult = ( x, y ) => {
    let a, b, s;
    a = new BigNumber( x );
    b = new BigNumber( y );
    if ( a.gt( b ) ) s = a, a = b, b = s;

    s = new BigNumber( 0 );
    while ( a.gt( '0' ) ) {
        if ( a.c[ a.c.length - 1 ] & 1 )
            s = s.add( b );
        a = a.divToInt( 2 );
        b = b.mul( 2 )
    }

    return s;
}
