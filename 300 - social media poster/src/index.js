dotenv = require( 'dotenv' ).config()

const express = require( 'express' ),
multer = require( 'multer' ),
axios = require( 'axios' ),
cors = require( 'cors' ),
path = require( 'path' ),


app = express(),
PORT = process.env.PORT || 3000,
upload = multer({ dest: 'uploads/' })

app.use( express.json())
app.use( express.static( path.join( __dirname, '../public')))
app.use( cors())

app.post( '/post', upload.single( 'media' ), async ( req, res ) => {
  const { post } = req.body, media = req.file ? req.file.path : null
console.log('post', post)
  try {
    const response = await axios.post( 'https://app.ayrshare.com/api/post', 
      {
        post,
        mediaUrls: media ? [ media ] : [ "https://img.ayrshare.com/012/gb.jpg" ],
        platforms: [ "twitter", "facebook", "instagram", "linkedin", "pinterest" ],
      },
      { headers: { 'Authorization': `Bearer ${ process.env.AYRSHARE_API_KEY }` }}
    )
    res.json( response.data )
  } catch ( err ) {
    console.error( err )
    res.status( 500 ).json({ error: 'Failed to post to social media.' })
  }
})

app.listen( PORT, () => { console.log( `Server is running at http://localhost:${ PORT }` )})