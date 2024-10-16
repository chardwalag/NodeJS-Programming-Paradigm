document.addEventListener( "DOMContentLoaded", () => {
  const productList = document.getElementById( "product-list" ),

  fetchProducts = async () => {
    try {
      const response = await fetch( 'http://localhost:3000/products' )
      if ( !response.ok ) {
        throw new Error( 'Network response was not ok' )
      }
      const products = await response.json()
      products.forEach(({ node }) => {
        const listItem = document.createElement( "li" )
        listItem.innerHTML = `<h2>${ node.title }</h2><p>${ node.description }</p>`
        productList.appendChild( listItem )
      });
    } catch ( err ) {
      console.error( "Error fetching products:", err )
    }
  }

  fetchProducts()
})