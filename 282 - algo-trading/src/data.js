const generateRandomPrices = days => {
  const prices = []
  let currentPrice = 100 // Starting price
  for ( let i = 0; i < days; i++ ) {
    // Randomly adjust the price by -2 to +2 to simulate price movement
    currentPrice += ( Math.random() * 4 - 2 )
    prices.push({ 
      date: new Date( Date.now() - ( days - i ) * 24 * 60 * 60 * 1000 ).toISOString().split( 'T' )[ 0 ],
      close: currentPrice.toFixed( 2 )
    })
  }
  return prices
},

// Simple Moving Average (SMA)
calculateSMA = ( data, period ) => {
  const sma = []
  for ( let i = period - 1; i < data.length; i++ ) {
    const sum = data.slice( i - period + 1, i + 1 ).reduce(( acc, curr ) => acc + parseFloat( curr.close ), 0 )
    sma.push({ date: data[i].date, value: sum / period })
  }
  return sma;
},

// trading logic and return signals based on SMA crossover
calculateTradingSignals = prices => {
  const shortTerm = 3, // Short-term SMA period
  longTerm = 5, // Long-term SMA period

  shortSMA = calculateSMA( prices, shortTerm ),
  longSMA = calculateSMA( prices, longTerm )

  let signals = []

  console.log( "Historical Prices:", prices )
  console.log( "Short SMA:", shortSMA )
  console.log( "Long SMA:", longSMA )

  for ( let i = Math.max( shortTerm, longTerm ) - 1; i < prices.length; i++ ) {
    const currentDate = prices[ i ].date,
    shortValue = shortSMA[ i - shortTerm + 1 ]?.value,
    longValue = longSMA[ i - longTerm + 1 ]?.value

    console.log( `Date: ${ currentDate }, Short SMA: ${ shortValue }, Long SMA: ${ longValue }` )

    // Check for buy signal
    if ( shortValue > longValue && !signals.some( signal => signal.action === 'Buy' && signal.date === currentDate )) {
      signals.push({ date: currentDate, action: 'Buy', price: prices[i].close })
      console.log( `Buy Signal on ${ currentDate }: Price ${ prices[ i ].close }` )
    }
    
    // Check for sell signal
    if ( shortValue < longValue && !signals.some( signal => signal.action === 'Sell' && signal.date === currentDate )) {
      signals.push({ date: currentDate, action: 'Sell', price: prices[ i ].close })
      console.log( `Sell Signal on ${ currentDate }: Price ${ prices[ i ].close }` )
    }
  }
  return signals
}


module.exports = { calculateTradingSignals, generateRandomPrices }