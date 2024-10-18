const fetchTradingSignals = async () => {
  try {
    const response = await fetch( 'http://localhost:3000/api/trading-signals' )
    if ( !response.ok ) throw new Error( 'Network response was not ok' )
    
    const signals = await response.json()
    populateTable( signals )
  } catch ( err ) {
    console.error( 'Error fetching trading signals:', err )
  }
},

populateTable = signals => {
  const tableBody = document.querySelector( '#signals-table tbody' )
  tableBody.innerHTML = ''

  signals.forEach( signal => {
    const row = document.createElement( 'tr' )
    row.innerHTML = `
      <td>${ signal.date }</td>
      <td>${ signal.action }</td>
      <td>${ signal.price }</td>
    `
    tableBody.appendChild( row )
  })
}

window.onload = fetchTradingSignals