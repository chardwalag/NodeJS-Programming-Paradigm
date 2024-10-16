require( 'dotenv' ).config()

const express = require( 'express' ),
cors = require( 'cors' ),
fetch = require( 'node-fetch' ),

app = express(),
PORT = process.env.PORT || 3000,

SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL,
SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN,
graphqlEndpoint = `https://${ SHOPIFY_STORE_URL }/admin/api/2023-01/graphql.json`

app.use( cors())
app.use( express.static( 'public' ))

app.get( '/products', async ( req, res ) => {
  const query = `
  {
    products(first: 5) {
      edges {
        node {
          id
          title
          handle
          descriptionHtml
          variants(first: 1) {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      }
    }
  }`

  try {
    const response = await fetch( graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query }),
    }),
    data = await response.json()
    res.json( data.data.products.edges )
  } catch ( err ) {
    console.error( 'Error fetching products:', err )
    res.status( 500 ).json({ error: 'Internal Server Error' })
  }
})

app.listen( PORT, () => console.log( `Server running at http://localhost:${ PORT }` ))