document
  .getElementById( 'generate' )
  .addEventListener( 'click', async () => {
    const label = document.getElementById( 'label' ).value,
    step = document.getElementById( 'step' ).value,
    algorithm = document.getElementById( 'algorithm' ).value,
    sharedSecret = document.getElementById( 'sharedSecret' ).value,
    serviceName = document.getElementById( 'serviceName' ).value,
    digits = document.getElementById( 'digits' ).value

    try {
      const response = await fetch( '/generate-qrcode-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, step, algorithm, sharedSecret, serviceName, digits })
      }),
      data = await response.json()
      if ( response.ok ) {
        const { qrCodeUrl, token } = data
        document.getElementById( 'qr-code' ).innerHTML = `<img src="${ qrCodeUrl }" alt="QR Code" />`
        document.getElementById( 'token' ).innerText = `Current TOTP: ${ token }`
      }
      else alert( data.message )
    } catch ( err ) {
      console.error( 'Error registering user:', err )
    }
})