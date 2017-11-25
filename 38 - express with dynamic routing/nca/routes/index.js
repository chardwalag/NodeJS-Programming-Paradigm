
var express = require( 'express' );
var router = express.Router();

/* GET home page. */
router.get(
  '/',
  ( req, res, next ) => {
    res.render('index', { title: 'Express' });
  }
);

router.get(
  '/page',
  ( req, res ) => {
    res.send( 'Hello I am Mr Page' );
  }
);

router.get(
  '/*paged*',
  ( req, res ) => {
    res.send( 'Hello I am Mr Paged' );
  }
);

router.get(
  '/:page([a-zA_Z]+)',
  ( req, res ) => {
    res.send( 'Welcome to the ' + req.params.page +  ' page' );
  }
);

router.get(
  '/:page/:admin((add|delete))',
  ( req, res ) => {
    res.send( 'So you want to ' + req.params.admin + ' ' + req.params.page + '?' );
  }
);

router.get(
  '/:page/*',
  ( req, res ) => {
    let child = req.params[ 0 ],
      parent = child ? ' of the ' + req.params.page + ' page' : '';
    
    res.send( 'Welcome to the ' + ( child || req.params.page ) + ' page' + parent );
  }
);

module.exports = router;
