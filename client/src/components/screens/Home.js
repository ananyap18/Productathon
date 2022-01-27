import React, {useState, useEffect} from 'react'
import './Home.css'
import Post from '../utils/Post'

function Home() {
  const [posts, setPosts] = useState([])

  const getPosts = async() => {
    try{
      const response = await fetch('/allposts', {
        headers: { 
          'method': 'GET',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }        
      })
      const resJSON = await response.json()
      setPosts(resJSON)
    }catch(e){
      console.log(e)
    }
  }

  useEffect( () => {getPosts()}
  , [])

  const postsToRender = posts.map(post => <Post key={post._id} post={post} />)

  return (
    <div className="home">
      <ul className="posts">
      {posts.length === 0?"No Post Found :(":postsToRender}
      </ul>
    </div>
  )
}

export default Home
