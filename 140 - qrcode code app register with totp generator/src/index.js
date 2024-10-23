require( 'dotenv' ).config()

const express = require( 'express' ),
{ authenticator } = require( 'otplib' ),
QRCode = require( 'qrcode' ),


app = express(),
PORT = process.env.PORT || 3000

app.use( express.json())
app.use( express.static( 'public' ))


let userSecrets = {};

app.post( '/user/register', async ( req, res ) => {
  let { email, step, algorithm, t0, sharedSecret, serviceName } = req.body

  if ( !email ) return res.status( 400 ).json({ message: 'Email is required' })

  const secret = sharedSecret || process.env.SHARED_SECRET || authenticator.generateSecret(),
  otpauth = authenticator.keyuri( email, serviceName || process.env.APP_NAME || 'AppName', secret )

  t0 = isNaN( t0 ) ? ( process.env.INITIAL_TIME_IN_SEC || 0 ) : t0
  userSecrets[ email ] = { secret, step, algorithm, t0 }

  try {
    const qrCodeUrl = await QRCode.toDataURL( otpauth )
    res.json({ email, qrCodeUrl, secret })
  } catch ( err ) {
    res.status( 500 ).json({ message: 'Error generating QR code', error })
  }
})

app.post( '/user/totp', ( req, res ) => {
  const { email } = req.body

  if ( !email || !userSecrets[ email ])
    return res.status( 404 ).json({ message: 'User not found or not registered' })

  let { secret, step, algorithm, t0 } = userSecrets[ email ]
  algorithm = ( algorithm || 'SHA1' ).toLowerCase()
  
  authenticator.options = {
    step: Number( step ) || 30,
    algorithm,
    digits: 6,
    epoch: Number( t0 ) || Math.floor(Date.now() / 1000)
  }

  const token = authenticator.generate( secret )
  res.json({ token })
})

app.listen( PORT, () => { console.log( `Server is listening on port ${ PORT }` )})