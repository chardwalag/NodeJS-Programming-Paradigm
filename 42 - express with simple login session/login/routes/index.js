var express = require('express');
var router = express.Router();
var users = { 'name': 'password' };

function index( req, res ) {
  res.render( 'index', { title: 'Express', user: req.session.user } );
}

router.route( '/' )
  .get( index )
  .post(
    function login( req, res ) {
      var user = req.body.user;
        Object.keys( users ).forEach(
          function ( name ) {
            if (  req.body.username === name && req.body.userpwd === users[ name ] )
              req.session.user = {
                name: name,
                pwd: users[ name ]
              }
          }
        );
      index( req, res );
    }
  )
  .delete(
    function logout( req, res ) {
      delete req.session.user;
      index( req, res );
    }
  );

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

module.exports = router;
