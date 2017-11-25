
var express = require('express');
var router = express.Router();
var profiles = require( '../models/profiles' );

function safeMix ( jade_mixins, mixins ) {
  mixins = Array.prototype.slice.call( arguments, 1 );
  mixins.forEach( mixin => jade_mixins[ mixin ] = jade_mixins[ mixin ] || safeMix.noop );
}
safeMix.noop = () => {}

router.get(
  '/:pagenum([0-9]+)?',
  ( req, res ) => {
    profiles.pull(
      req.params.pagenum,
      ( err, profiles ) => {
        if (err) throw err;
        res.render( 'index', { title: 'Profiler', profiles, page: req.params.pagenum, safeMix } );
      }
    );
  }
);

module.exports = router;
