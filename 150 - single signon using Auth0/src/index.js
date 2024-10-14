require( 'dotenv' ).config()

const express = require( 'express' ),
session = require( 'express-session' ),
passport = require( 'passport' ),
Auth0Strategy = require( 'passport-auth0' ),


app = express(),

PORT = process.env.PORT || 3000

app.use( session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))

passport.use(
  new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.BASEURL,
    },
    ( accessToken, refreshToken, extraParams, profile, done ) => {
      return done( null, profile )
    }
  )
)

passport.serializeUser(( user, done ) => { done( null, user )})

passport.deserializeUser(( user, done ) => { done( null, user )})

app.use( passport.initialize())
app.use( passport.session())

app.get(
  '/login',
  passport.authenticate( 'auth0', { scope: 'openid email profile' })
)

app.get(
  '/callback', 
  passport.authenticate( 'auth0', { failureRedirect: '/' }),
  ( req, res ) => {
    console.log( 'callback endpoint is called' )
    res.redirect( '/' )
  }
)

app.get(
  '/',
  ( req, res ) => {
    res.send(`
      <h1>Welcome</h1>
      ${ req.isAuthenticated() ? `<p>Hello, ${ req.user.name.givenName }</p>` : '<p><a href="/login">Log In</a></p>'}
    `)
  }
)

app.get( '*', ( req, res ) => res.sendStatus( 404 ))

app.listen( PORT, () => { console.log( `Server is running on http://localhost:${ PORT }` )})