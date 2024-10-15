document
  .getElementById( 'productForm' )
  .addEventListener(
    'submit',
    async ( ev ) => {
      ev.preventDefault()

      const name = document.getElementById( 'name' ).value,
      brand = document.getElementById( 'brand' ).value,
      manufacturer = document.getElementById( 'manufacturer' ).value,

      response = await fetch(
        '/products',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, brand, manufacturer })
        }
      )

      if ( response.ok ) {
        showMessage( "Product added successfully!" )
        document.getElementById( 'name' ).value = ''
        document.getElementById( 'brand' ).value = ''
        document.getElementById( 'manufacturer' ).value = ''
        fetchProducts()
      }
      else showMessage( "Error adding product." )
})

const fetchProducts = async () => {
  const response = await fetch( '/products' )
  
  if ( response.ok ) {
    const products = await response.json(),
    productList = document.getElementById( 'productList' )
    productList.innerHTML = ''
    products.forEach( product => {
      const li = document.createElement( 'li' )
      li.innerText = `${ product.name } (${ product.brand }, ${ product.manufacturer })`
      
      const deleteButton = document.createElement( 'button' )
      deleteButton.innerText = "Delete"
      deleteButton.onclick = async () => {
        const response = await fetch( `/products/${ product.id }`, { method: 'DELETE' })
        if ( response.ok ) {
          showMessage( `Product ${ product.name } deleted.` )
          fetchProducts()
        }
        else
          showMessage( `Unable to delete product ${ product.name }.` )
      }
      
      li.appendChild( deleteButton )
      productList.appendChild( li )
    })
  } else {
    console.error( "Failed to fetch products" )
  }
},

showMessage = msg => {
  document.getElementById( 'message' ).innerText = msg
  setTimeout(() => { document.getElementById( 'message' ).innerText = "" }, 3000 )
}

fetchProducts()