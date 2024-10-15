const express = require( 'express' ),
ollama = require( 'ollama' ).default,
bodyParser = require( 'body-parser' ),
cors = require( 'cors' ),


app = express(),
PORT = process.env.PORT || 3000

app.use( cors())
app.use( bodyParser.json())
app.use( express.static( 'public' ))

app.post( '/api/ask-query', async ( req, res ) => {
  const { query } = req.body
  console.log( 'Query:', query )

  try {
    const response = await ollama.chat({ model: 'mstrancy', messages: [{ role: 'user', content: query }]})
    res.json({ reply: response.message.content })
    console.log( 'Reply:', response.message.content )
  } catch ( err ) {
    console.error( 'Chat Error:', err )
    res.status( 500 ).send({ error: 'Error interacting with the model' })
  }
})

app.listen( PORT, () => { console.log( `Server is running on port ${ PORT }` )})