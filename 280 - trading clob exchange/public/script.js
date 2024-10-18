document
  .getElementById( 'orderForm' )
  .addEventListener( 'submit', async ( ev ) => {
    ev.preventDefault();

    const type = document.getElementById( 'type' ).value,
    price = document.getElementById( 'price' ).value,
    quantity = document.getElementById( 'quantity' ).value,
    response = await fetch( '/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, price, quantity })
    })

    if ( response.ok ) {
      alert( 'Order placed successfully!' )
      loadOrderBook()
      document.getElementById( 'orderForm' ).reset()
    }
    else alert( 'Failed to place order.' )
})

const loadOrderBook = async () => {
  const response = await fetch( '/orderbook' )
  
  if ( response.ok ) {
    const orderBook = await response.json()
    
    let displayText = "Buy Orders:\n"
    orderBook.buy.forEach( order => {
      displayText += `Price: ${ order.price }, Quantity: ${ order.quantity }\n`
    })

    displayText += "\nSell Orders:\n"
    orderBook.sell.forEach( order => {
      displayText += `Price: ${ order.price }, Quantity: ${ order.quantity }\n`
    })

    document.getElementById( 'orderBookDisplay' ).textContent = displayText
  }
}

loadOrderBook()