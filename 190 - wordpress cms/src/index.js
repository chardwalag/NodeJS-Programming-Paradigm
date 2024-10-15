require( 'dotenv' ).config()

const express = require( 'express' ),
axios = require( 'axios' ),
bodyParser = require( 'body-parser' ),
cors = require( 'cors' ),
path = require( 'path' ),


app = express(),
PORT = process.env.PORT || 3000

app.use( cors())
app.use( bodyParser.json())
app.use( express.static( path.join( __dirname, 'public' )))

app.post( '/login', async ( req, res ) => {
  const { username, password } = req.body
  try {
    const response = await axios.post( process.env.AUTH_URL, { username, password })
    res.json( response.data )
  } catch ( err ) {
    console.error( 'Loging error:', err )
    res.status( 401 ).send( 'Invalid credentials' )
  }
})

app.get( '/posts', async ( req, res ) => {
  try {
    const response = await axios.get( process.env.WORDPRESS_API_URL )
    res.json( response.data )
  } catch ( err ) {
    console.error( 'Posts error:', err )
    res.status( 500 ).send( 'Error fetching posts' )
  }
})

app.post( '/posts', async ( req, res ) => {
  const { accessToken, title, content } = req.body,
  postData = { title, content, status: 'publish' }

  try {
    const response = await axios.post(
      process.env.WORDPRESS_API_URL,
      postData,
      { headers: { 'Authorization': `Bearer ${ accessToken }` }}
    )
    res.json( response.data )
  } catch ( err ) {
    console.error('Create post error:', err )
    res.status( 500 ).send( 'Error creating post' )
  }
})

app.put( '/posts/:id', async ( req, res ) => {
  const { accessToken, title, content } = req.body, postId = req.params.id,
  postData = { title, content, status: 'publish' }

  try {
    const response = await axios.put(
      `${ process.env.WORDPRESS_API_URL }/${ postId }`,
      postData, 
      { headers: { 'Authorization': `Bearer ${ accessToken }` }}
    )
    res.json( response.data )
  } catch ( err ) {
    console.error('Update post error:', err )
    res.status( 500 ).send( 'Error updating post' )
  }
})

app.delete( '/posts/:id', async ( req, res ) => {
  const accessToken = req.headers[ 'authorization' ].split( ' ' )[ 1 ],
  postId = req.params.id

  try {
    await axios.delete(
      `${ process.env.WORDPRESS_API_URL }/${ postId }`,
      { headers: { 'Authorization': `Bearer ${ accessToken }` }}
    )
    res.sendStatus( 204 )
  } catch ( err  ) {
    console.error('Delete post error:', err )
    res.status( 500 ).send( 'Error deleting post' )
  }
})

app.listen( PORT, () => { console.log(`Node.js server is running on http://localhost:${ PORT }` )})