require( 'dotenv' ).config()

const express = require( 'express' ),
QRCode = require( 'qrcode' ),
base32 = require( 'base32.js' ),
OTPAuth = require( 'otpauth' ),


app = express(),
PORT = process.env.PORT || 3000,

asciiToBase32 = msg => {
  const buffer = Buffer.from( msg, 'utf8' )
  return base32.encode( buffer ).replace( /=/g, '' )
},

createTOTP = (
  label = 'name',
  secret = 'ABCD',
  algorithm = 'SHA1',
  digits = 6,
  period = 30,
  serviceName = 'AppName' 
) => new OTPAuth.TOTP({ issuer: serviceName, label, algorithm, digits, period, secret })

app.use( express.json())
app.use( express.static( 'public' ))

app.post( '/generate-qrcode-otp', async ( req, res ) => {
  const { label, sharedSecret, algorithm, digits, step, serviceName } = req.body
  try {
    const secret = asciiToBase32( sharedSecret || process.env.SHARED_SECRET ),
    totp = createTOTP(
      label || process.env.LABEL,
      secret || process.env.SHARED_SECRET,
      algorithm || process.env.ALGO,
      digits || process.env.TOKEN_SIZE,
      step || process.env.STEP,
      serviceName || process.env.APP_NAME
    ),
    qrCodeUrl = await QRCode.toDataURL( totp.toString())
    res.json({ qrCodeUrl, token: totp.generate()})
  } catch ( err ) {
    res.status( 500 ).json({ message: 'Error generating QR code', error })
  }
})

app.listen( PORT, () => { console.log( `Server is listening on port ${ PORT }` )})