
const express  = require( 'express' );

const profiles = require( '../profiles' );

const router = express.Router();

/* GET home page. */
router.get(
  '/',
  ( req, res ) => {
    res.render( 'index', { title: 'Profiles', profiles } );
  }
);

module.exports = router;
