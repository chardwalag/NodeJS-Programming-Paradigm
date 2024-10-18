const socket = io(),

fetchBlockchain = () => {
  fetch( '/blocks' )
    .then( response => response.json())
    .then( data => {
      document.getElementById( 'blockchainData' ).innerText = JSON.stringify( data, null, 2 )
    })
    .catch( err => console.error( 'Error fetching blockchain:', err ))
}

document
  .getElementById( 'submitTransaction' )
  .addEventListener( 'click', () => {
    const sender = document.getElementById( 'sender' ).value,
    recipient = document.getElementById( 'recipient' ).value,
    amount = document.getElementById( 'amount' ).value,

    tx = { sender, recipient, amount }

    socket.emit( 'newTransaction', tx )

    document.getElementById( 'sender' ).value = ''
    document.getElementById( 'recipient' ).value = ''
    document.getElementById( 'amount' ).value = ''
})

socket.on( 'transactionAdded', tx => { alert( `Transaction added: ${ JSON.stringify( tx )} `)})

socket.on( 'blockAdded', blk => {
  // alert( `New block added: ${ JSON.stringify( blk )}` )
  fetchBlockchain() // Refresh blockchain display when a new block is added
})

fetchBlockchain()