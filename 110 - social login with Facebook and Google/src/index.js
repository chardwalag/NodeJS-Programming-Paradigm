require( 'dotenv' ).config()

const express = require( 'express' ),
session = require( 'express-session' ),
passport = require( 'passport' ),
GoogleStrategy = require( 'passport-google-oauth20' ).Strategy,
FacebookStrategy = require( 'passport-facebook' ).Strategy,


app = express()

// Middleware
app.use( session({ secret: process.env.SECRET_KEY, resave: false, saveUninitialized: true }))
app.use( passport.initialize())
app.use( passport.session())

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  ( accessToken, refreshToken, profile, done ) => {
    // Here you can save user information to your database
    return done( null, profile )
  })
)

passport.use(
  new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: [ 'id', 'displayName', 'photos', 'email' ]
  },
  ( accessToken, refreshToken, profile, done ) => {
    // Here you can save user information to your database
    return done( null, profile )
  })
)

passport.serializeUser(( user, done ) => {
  done( null, user );
})

passport.deserializeUser(( user, done ) => {
  done( null, user );
})

app.get(
  '/auth/google',
  passport.authenticate( 'google', { scope: [ 'profile', 'email' ]})
)

app.get(
  '/auth/google/callback',
  passport.authenticate( 'google' ),
  ( req, res ) => {
    res.redirect( '/hello' ) // Customize your route after successful login
  }
)

app.get(
  '/auth/facebook',
  passport.authenticate( 'facebook' )
)

app.get(
  '/auth/facebook/callback',
  passport.authenticate( 'facebook' ),
  ( req, res ) => {
    res.redirect( '/hello' ) // Customize your route after successful login
  }
)

app.get(
  '/hello',
  ( req, res ) => {
    if ( !req.isAuthenticated()) return res.redirect( '/' )
    res.send( `<h1>Hello ${ req.user.displayName }</h1>` )
  }
)

// Home route
app.get(
  '/',
  ( req, res ) => {
    res.send( '<h1>Home</h1><a href="/auth/google">Login with Google</a><br><a href="/auth/facebook">Login with Facebook</a>' )
  }
)

app.listen(
  3000,
  () => { console.log( 'Server is running on http://localhost:3000' )}
)