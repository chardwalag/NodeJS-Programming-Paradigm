const Hapi = require( '@hapi/hapi' ),
Path = require( 'path' ),
Inert = require( '@hapi/inert' ),


init = async () => {
  const server = Hapi.server({ port: 3000, host: 'localhost' })

  await server.register( Inert )

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: Path.join( __dirname, '../public' ),
        redirectToSlash: true,
        index: [ 'index.html' ]
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/products',
    handler: ( request, h ) => {
      const { name, brand, manufacturer } = request.payload,
      newProduct = { id: products.length + 1, name, brand, manufacturer }
      products.push( newProduct )
      return h.response( newProduct ).code( 201 )
    }
  })

  server.route({
    method: 'GET',
    path: '/products',
    handler: () => products
  })

  server.route({
    method: 'GET',
    path: '/products/{id}',
    handler: ( request, h ) => 
      products.find( p => p.id === parseInt( request.params.id )) ?? h.response({ error: 'Product not found' }).code( 404 )
  })

  server.route({
    method: 'PATCH',
    path: '/products/{id}',
    handler: ( request, h ) => {
      const product = products.find( p => p.id === parseInt( request.params.id ))
      if ( !product ) return h.response({ error: 'Product not found' }).code( 404 )
      const { name, brand, manufacturer } = request.payload
      product.name = name || product.name
      product.brand = brand || product.brand
      product.manufacturer = manufacturer || product.manufacturer
      return product;
    }
  })

  server.route({
    method: 'DELETE',
    path: '/products/{id}',
    handler: ( request, h ) => {
      const index = products.findIndex( p => p.id === parseInt( request.params.id ))
      if ( index === -1 ) return h.response({ error: 'Product not found' }).code( 404 )
      products.splice( index, 1 )
      return h.response({ message: 'Product deleted' }).code( 204 )
    }
  });

  await server.start()
  console.log( 'Server running on %s', server.info.uri )
}

let products = [];

process.on( 'unhandledRejection', err => {
  console.log( err )
  process.exit( 1 )
})

init()