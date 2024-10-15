require( 'dotenv' ).config()

const express = require( 'express' )
session = require( 'express-session' ),
passport = require( 'passport' ),
{ Issuer, Strategy } = require( 'openid-client' ),


app = express(),
PORT = process.env.PORT

app.use( session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }))
app.use( passport.initialize())
app.use( passport.session())

Issuer.discover( 'https://openid-connect.onelogin.com/oidc' ).then( issuer => {
  const client = new issuer.Client({
    client_id: process.env.OIDC_CLIENT_ID,
    client_secret: process.env.OIDC_CLIENT_SECRET,
    redirect_uris: [ `http://localhost:${ PORT }/${ process.env.CALLBACK_URL}` ],
    response_types: [ 'code' ],
  })

  passport.use(
    'openidconnect',
    new Strategy({ client }, ( tokenset, userinfo, done ) => { return done( null, userinfo )})
  )

  passport.serializeUser(( user, done ) => { done( null, user )})

  passport.deserializeUser(( user, done ) => { done( null, user )})

  app.get( '/login', passport.authenticate( 'openidconnect' ))

  app.get(
    process.env.CALLBACK_URL,
    passport.authenticate( 'openidconnect', {
      successReturnToOrRedirect: '/users',
      failureRedirect: '/'
    })
  )

  app.get( '/users', ( req, res ) => { res.send( `Hello ${ req.user.name }` )})

  app.get( '/logout', ( req, res ) => {
    req.logout()
    res.redirect( '/' )
  })

  app.listen( PORT, () => { console.log( `Server is running on http://localhost:${ PORT }` )})
})