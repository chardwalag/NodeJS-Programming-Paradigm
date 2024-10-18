const express = require( 'express' ),
http = require( 'http' ),
socketIo = require( 'socket.io' ),
Blockchain = require( './blockchain' ),


app = express(),
server = http.createServer( app ),
io = socketIo( server ),
PORT = 3000

app.use( express.json())
app.use( express.static( 'public' ))

const blockchain = new Blockchain(),

// simulate block mining
generateRandomBlocks = () => {
  setInterval(() => {
    blockchain.createRandomBlock()
    io.emit( 'blockAdded', blockchain.getLatestBlock())
    console.log( `Random block added: ${ JSON.stringify( blockchain.getLatestBlock())}` )
  }, 60000 ) // Generate a new block every 10 seconds
}

app.get( '/blocks', ( req, res ) => { res.send( blockchain.chain )})

app.post( '/transactions', ( req, res ) => {
  const { sender, recipient, amount } = req.body
  blockchain.createTransaction( sender, recipient, amount )
  res.send( `Transaction added: ${ JSON.stringify(req.body )}` )
})

io.on( 'connection', socket => {
  console.log( 'New client connected' )
  socket.on( 'newTransaction', tx => {
    blockchain.createTransaction( tx.sender, tx.recipient, tx.amount )
    io.emit( 'transactionAdded', tx )
  })
})

generateRandomBlocks()

server.listen( PORT, () => { console.log( `Server running on port ${ PORT }` )})