
const { resolveSoa } = require('dns');
const express = require( 'express' ),
// http = require( 'http' ),
https = require( 'https' ),
path = require( 'path' ),
fs = require( 'fs' );


PORT = process.env.PORT || 3000,
// folder = 'dist',
folder = 'public',
app = express(),
// server = http.createServer( app ),
options = { key: fs.readFileSync( 'key.pem' ), cert: fs.readFileSync( 'cert.pem' )},
server = https.createServer( options, (req, res) => {
  const pathToHtmlFile = path.resolve( __dirname, `../${ folder }/index.html` ),
  contentFromHtmlFile = fs.readFileSync( pathToHtmlFile, 'utf-8' );
  // res.send( contentFromHtmlFile );
  res.writeHead( 200 );
  res.end();
}),
io = require( 'socket.io' )( server );

app.use( express.static( folder ));

// app.get( '/', ( req, res ) => res.sendFile( __dirname + `/${ folder }/index.html` ));
// app.get( '/', ( req, res ) => res.sendFile( path.resolve( __dirname, `/${ folder }/index.html` )));
app.get( '/', ( req, res ) => {
  const pathToHtmlFile = path.resolve( __dirname, `../${ folder }/index.html` ),
  contentFromHtmlFile = fs.readFileSync( pathToHtmlFile, 'utf-8' );
  res.send( contentFromHtmlFile );
  res.end( '' );
});

let users = [], userCount = 0;

const broadcastOnlineUser = () => users.forEach( user => {
  const { sid } = user;
  io.to( sid ).emit( 'online-users', { user, users: users.filter(({ sid: id }) => id !== sid )});
});

io.on( 'connection', socket => {
  users.push({ sid: socket.id, uid: userCount });
  broadcastOnlineUser();
  ++userCount;

  socket.on( 'call', sid => {
    io.to( sid ).emit( 'call', socket.id );
  });

  socket.on( 'notify-busy', sid => {
    io.to( sid ).emit( 'notify-busy', socket.id );
  });

  socket.on( 'cancel-call', id => {
    io.to( id ).emit( 'cancel-call', socket.id );
  });
  
  socket.on( 'reject-call',  sid => {
    io.to( sid ).emit( 'reject-call' );
  });

  socket.on( 'accept-call',  sid => {
    io.to( sid ).emit( 'accept-call' );
  });

  socket.on( 'send-offer',  ({ sid, offer }) => {
    io.to( sid ).emit( 'send-offer', offer );
  });

  socket.on( 'send-answer',  ({ sid, answer }) => {
    io.to( sid ).emit( 'send-answer', answer );
  });

  socket.on( 'send-candidate',  ({ sid, candidate }) => {
    io.to( sid ).emit( 'send-candidate', candidate );
  });

  socket.on( 'end-call',  sid => {
    io.to( sid ).emit( 'end-call' );
  });

  socket.on( 'disconnect', () => {
    users = users.filter(({ sid }) => sid !== socket.id );
    broadcastOnlineUser();
  });
});

server.listen( PORT, () => console.log( `listening at ${ PORT }`));
