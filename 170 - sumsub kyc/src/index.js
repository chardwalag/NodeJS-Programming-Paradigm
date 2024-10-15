require( 'dotenv' ).config()

const express = require( 'express' ),
axios = require( 'axios' ),


app = express(),
PORT = process.env.PORT || 3000

app.use( express.static( 'public' ))

app.get( '/generate-token', async ( req, res ) => {
  try {
    const response = await axios.post(
      `${ process.env.SUMSUB_API_URL }/resources/accessTokens`,
      { levelName: 'kyc-sl-group' },
      { 
        headers: {
          'Authorization': `Bearer ${ process.env.SUMSUB_APP_TOKEN }`,
          'Content-Type': 'application/json',
        }
      }
    )
    res.json({ accessToken: response.data.accessToken })
  } catch ( err ) {
    console.error( 'Error generating access token:', err )
    res.status( 500 ).send( 'Error generating access token' )
  }
})

app.listen( PORT, () => { console.log( `Server is running on http://localhost:${ PORT }` )})