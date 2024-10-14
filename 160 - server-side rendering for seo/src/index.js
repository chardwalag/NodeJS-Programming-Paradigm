const express = require( 'express' ),
path = require( 'path' ),
sitemap = require( 'sitemap' ).SitemapStream,
{ Readable } = require( 'stream' ),


app = express(),
PORT = process.env.PORT || 3000,

pages = [
  {
    url: `http://localhost:${ PORT }`,
    title: 'Home Page',
    description: 'Welcome to our home page.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "My Website",
      "url": "http://localhost:3000"
    }
  },
  {
    url: `http://localhost:${ PORT }/about`,
    title: 'About Us',
    description: 'Learn more about us.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Us",
      "description": "Learn more about our mission and values."
    }
  },
]

app.set( 'view engine', 'ejs' )
app.set( 'views', path.join( __dirname, './views' ))

app.get( '/', ( req, res ) => { res.render( 'index', { page: pages[ 0 ]})})

app.get( '/about', ( req, res ) => { res.render( 'about', { page: pages[ 1 ]})})

app.get(
  '/sitemap.xml',
  ( req, res ) => {
    res.header( 'Content-Type', 'application/xml' )

    const sitemapStream = new sitemap(),
    links = pages.map( page => ({ url: page.url, changefreq: 'daily', priority: 0.8 }))
    stream = Readable.from( links )
    
    stream.pipe( sitemapStream ).pipe( res )
  }
)

app.listen( PORT, () => { console.log( `Server is running on http://localhost:${ PORT }` )})