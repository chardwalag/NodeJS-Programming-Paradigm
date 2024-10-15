let accessToken = ''

document.getElementById( 'login' ).addEventListener(
  'click',
  async () => {
    const username = document.getElementById( 'username' ).value,
    password = document.getElementById( 'password' ).value,
    response = await fetch(
      '/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      }
    )

    if ( response.ok ) {
      const data = await response.json()
      accessToken = data.token
      alert( 'Login success!' )
      
      document.getElementById( 'fetch-posts' ).click()        
      document.getElementById( 'username' ).value = ''
      document.getElementById( 'password' ).value = ''
    } else {
      alert('Login failed!')
    }
  }
)

document.getElementById( 'fetch-posts' ).addEventListener(
  'click',
  async () => {
    const response = await fetch( '/posts' )
    if ( response.ok ) {
      const posts = await response.json(), postsDiv = document.getElementById('posts')
      postsDiv.innerHTML = ''
      
      posts.forEach( post => {
        const postElement = document.createElement( 'div' ), postId = post.id
        postElement.innerHTML =
          `<h3>${ post.title.rendered }</h3><p>${ post.content.rendered }</p>` +
          `<button class='edit' data-id='${ postId }'>Edit</button>` +
          `<button class='delete' data-id='${ postId }'>Delete</button>`
        postsDiv.appendChild( postElement )
        postElement.querySelector( '.edit' ).addEventListener( 'click', () => editPost( postId ))
        postElement.querySelector( '.delete' ).addEventListener( 'click', () => deletePost( postId ))
      })
    } else {
      console.error( 'Error fetching posts' )
    }
  }
)

document.getElementById( 'create-post' ).addEventListener(
  'click',
  async () => {
    const title = document.getElementById( 'post-title' ).value,
    content = document.getElementById( 'post-content' ).value,
    response = await fetch(
      '/posts',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ accessToken }`
         },
         body: JSON.stringify({ title, content })
      }
     )

     if ( response.ok ) {
         const newPost = await response.json()
         console.log( 'Post created:', newPost )
         document.getElementById( 'fetch-posts' ).click()
         document.getElementById( 'post-title' ).value = ''
         document.getElementById( 'post-content' ).value = ''
     } else {
        console.error( 'Error creating post' )
     }
  }
)

const editPost = async ( id ) => {
  const newTitle = prompt( "Enter new title:" ),
  newContent = prompt( "Enter new content:" )

  if ( newTitle && newContent ) {
    const response = await fetch(
      `/posts/${ id }`,
      {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ accessToken }`
        },
        body: JSON.stringify({ title: newTitle, content: newContent })
      }
    )

    if ( response.ok ) {
      console.log( `Post ${ id } updated successfully!` )
      document.getElementById( 'fetch-posts' ).click()
    } else {
      console.error( `Error updating post ${id}` )
    }
  }
},

deletePost = async ( id ) => {
  if ( confirm( "Sure to delete this post?" )) {
    const response = await fetch(
      `/posts/${ id }`,
      { method: 'DELETE', headers: { 'Authorization': `Bearer ${ accessToken }` }}
    )

    if ( response.ok ) {
      console.log( `Post ${ id } deleted successfully!` )
      document.getElementById( 'fetch-posts' ).click()
    } else {
      console.error( `Error deleting post ${ id }` )
    }
  }
}
