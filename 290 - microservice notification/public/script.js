document
  .getElementById( 'notificationForm' )
  .addEventListener( 'submit', ( e ) => {
    e.preventDefault()
    const message = document.getElementById( 'message' ).value
    fetch( '/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    .then( res => {
      if ( !res.ok) throw new Error( 'Network response was not ok' )
      return res.text()
    })
    .then(() => {
      document.getElementById( 'responseMessage' ).innerText = 'Notification sent successfully!'
      document.getElementById( 'message' ).value = ''
    })
    .catch( err => {
      console.error( 'Error:', err )
      document.getElementById( 'responseMessage' ).innerText = 'Failed to send notification.'
    })
})