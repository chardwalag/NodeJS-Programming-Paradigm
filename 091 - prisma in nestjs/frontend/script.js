const API_URL = 'http://localhost:3000/books',

fetchBooks = async () => {
  const response = await fetch( API_URL ),
  books = await response.json()
  bookList = document.getElementById( 'book-list' ),
  bookList.innerHTML = ''

  books.forEach( book => {
    const bookItem = document.createElement( 'div' )
    bookItem.className = 'book-item'
    bookItem.innerHTML = `
      <span style="width: 300px">${ book.title } by ${ book.author }</span>
      <button onclick="deleteBook(${ book.id })">Delete</button>
      <button onclick="editBook(${ book.id }, '${ book.title }', '${ book.author }')">Edit</button>
    `
    bookList.appendChild( bookItem )
  })
},

createBook = async ( book ) => {
console.log( 'create' )
  await fetch( API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( book ),
  })
},

deleteBook = async ( id ) => {
console.log( 'delete' )
  await fetch( `${ API_URL }/${ id }`, { method: 'DELETE' })
  fetchBooks()
},

editBook = ( id, title, author ) => {
  document.getElementById( 'title' ).value = title
  document.getElementById( 'author' ).value = author
  document.getElementById( 'book-form' ).onsubmit = async ( e ) => {
    e.preventDefault();
    await updateBook( id, { title, author })
    document.getElementById( 'title' ).value = ''
    document.getElementById( 'author' ).value = ''
    fetchBooks()
    resetForm()
  }
},

updateBook = async ( id, book ) => {
console.log( 'update' )
  await fetch( `${ API_URL }/${ id }`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
},

resetForm = () => {
  document
    .getElementById( 'book-form' )
    .onsubmit = async ( e ) => {
      e.preventDefault()
      
      const title = document.getElementById( 'title' ).value,
      author = document.getElementById( 'author' ).value

      await createBook({ title, author })
      document.getElementById( 'title' ).value = ''
      document.getElementById( 'author' ).value = ''
      fetchBooks()
  }
}

document
  .getElementById( 'book-form' )
  .addEventListener( 'submit', async ( e ) => {
    e.preventDefault()
    
    const title = document.getElementById( 'title' ).value,
    author = document.getElementById( 'author' ).value

    await createBook({ title, author });
    document.getElementById( 'title' ).value = ''
    document.getElementById( 'author' ).value = ''
    fetchBooks()
  }
)

fetchBooks()