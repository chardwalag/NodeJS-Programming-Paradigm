document
  .getElementById( 'register' )
  .addEventListener( 'click', async () => {
    const email = document.getElementById( 'email' ).value,
    step = document.getElementById( 'step' ).value,
    algorithm = document.getElementById( 'algorithm' ).value,
    t0 = document.getElementById( 't0' ).value,
    sharedSecret = document.getElementById( 'sharedSecret' ).value,
    serviceName = document.getElementById( 'serviceName' ).value

    if ( !email ) {
      alert( "Please enter an email." )
      return
    }

    try {
      const response = await fetch( '/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, step, algorithm, t0, sharedSecret, serviceName })
      }),
      data = await response.json()
      if ( response.ok ) {
        document.getElementById( 'qr-code' ).innerHTML = `<img src="${ data.qrCodeUrl }" alt="QR Code" />`
        alert( "User registered. Scan the QR code with your authenticator app." )
      }
      else alert( data.message )
    } catch ( err ) {
      console.error( 'Error registering user:', err )
    }
})

document
  .getElementById( 'generate-totp' )
  .addEventListener( 'click', async () => {
    const email = document.getElementById( 'email' ).value
    if ( !email ) {
      alert( "Please enter an email." )
      return
    }
    try {
      const response = await fetch( '/user/totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      }),
      data = await response.json()
      if ( response.ok )  document.getElementById( 'result' ).innerText = `Current TOTP: ${ data.token }`
      else alert( data.message )
    } catch ( err ) {
      console.error( 'Error generating TOTP:', err )
    }
  }
)