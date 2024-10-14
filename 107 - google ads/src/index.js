require( 'dotenv' ).config()

const express = require( 'express' ),
bodyParser = require( 'body-parser' ),
{ GoogleAdsApi } = require( 'google-ads-api' ),
fs = require( 'fs' ),
path = require( 'path' ),


app = express(),
PORT = process.env.PORT || 3000,

googleAdsClient = new GoogleAdsApi({
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  developer_token: process.env.DEVELOPER_TOKEN,
})

app.use( bodyParser.json())
app.use( express.static( 'public' ))

app.post( '/create-ad', async ( req, res ) => {
  const { adGroupId, headlines, descriptions } = req.body;

  try {
    const customer = googleAdsClient.Customer({
      customer_id: process.env.CUSTOMER_ID,
      refresh_token: process.env.REFRESH_TOKEN,
    });

    await customer.adGroupAds.create({
      operations: [{
        ad_group_ad: {
          ad_group: adGroupId,
          status: 'ENABLED',
          ad: {
            responsive_search_ad: {
              headlines: headlines.map( hdln => ({ text: hdln })),
              descriptions: descriptions.map( desc => ({ text: desc })),
            },
            final_urls: [ 'https://www.patreon.com/ChessPlaybook' ],
          },
        },
      }],
    })
    
    res.redirect( '/' )
  } catch ( err ) {
    console.error( 'Create ad error:', error )
    res.status( 500 ).json({ error: 'Failed to create ad' })
  }
});

app.get( '/ads', async ( req, res ) => {
  try {
    const customer = googleAdsClient.Customer({ customer_id: process.env.CUSTOMER_ID }),
    ads = await customer.adGroupAds.list()
    res.status( 200 ).json( ads )
  } catch ( err ) {
    console.error( 'Error fetching ads:', err )
    res.status( 500 ).json({ error: 'Failed to fetch ads' })
  }
})

app.get( '/', async ( req, res ) => {
  let ads = []
  
  try {
    const customer = googleAdsClient.Customer({ customer_id: process.env.CUSTOMER_ID })
    ads = await customer.adGroupAds.list()
  } catch ( err ) {
    console.error( 'Error fetching ads:', err )
  }

  fs.readFile( path.join( __dirname, '..public/index.html' ), 'utf8', ( err, data ) => {
    if ( err ) return res.status( 500 ).send( 'Error loading template' )
    const adsListHtml = ads.map(ad => `<li>Ad ID: ${ ad.id }, Status: ${ ad.status }</li>`).join( '' ),
    htmlContent = data.replace( '<!-- Dynamic content will be injected here -->', adsListHtml )
    res.send( htmlContent )
  })
})

app.listen( PORT, () => { console.log(`Server is running on http://localhost:${ PORT }` )})