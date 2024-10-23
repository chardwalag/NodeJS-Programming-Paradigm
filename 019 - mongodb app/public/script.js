const apiUrl = 'http://localhost:3000/products',

loadProducts = async () => {
  const response = await fetch( apiUrl ),
  products = await response.json()
  productList = document.getElementById( 'productList' )
  productList.innerHTML = ''
  products.forEach(product => {
    const productDiv = document.createElement( 'div' )
    productDiv.innerHTML = `
      <h3>${ product.title } (${ product.price })</h3>
      <p>${ product.description }</p>
      <p>Rating: ${ product.rating }</p>
      <button onclick="updateProduct('${ product._id }')">Update</button>
      <button onclick="deleteProduct('${ product._id }')">Delete</button>
    `
    productList.appendChild( productDiv )
  })
},

updateProduct = async ( id ) => {
  const newTitle = prompt( "Enter new title:" ),
  newDescription = prompt( "Enter new description:" )
  if ( newTitle && newDescription ) {
    await fetch( `${ apiUrl }/${ id }`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, description: newDescription })
    })
    loadProducts()
  }
},

deleteProduct = async ( id ) => {
  if ( confirm( "Are you sure you want to delete this product?" )) {
    await fetch(`${ apiUrl }/${ id }`, { method: 'DELETE' })
    loadProducts()
  }
}

document
  .getElementById( 'productForm' )
  .addEventListener( 'submit', async ( e ) => {
    e.preventDefault()
    const title = document.getElementById( 'title' ).value,
    description = document.getElementById( 'description' ).value,
    price = parseFloat( document.getElementById( 'price' ).value ),
    rating = parseFloat( document.getElementById( 'rating' ).value ),
    productData = { title, description, price, rating }
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    })
    document.getElementById( 'productForm' ).reset()
    loadProducts()
})

window.onload = loadProducts