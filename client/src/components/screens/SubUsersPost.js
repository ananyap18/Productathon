import React, {useState, useEffect} from 'react'
import Post from '../utils/Post'

function SubUsersPost() {
  const [posts, setPosts] = useState([])

  const getSubPost = async () => {
    try{
      const response = await fetch('/subposts', {
        headers: {
          'method': 'GET',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      const resJSON = await response.json()
      console.log(resJSON)
      setPosts(resJSON)
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    getSubPost()
  }, [])

  const postsToRender = posts.map(post => <Post key={post._id} post={post}/>)

  return (
    <div className="home">
      <ul className="posts">
      {posts.length === 0? "No Post Found :(": postsToRender}
      </ul>
    </div>
  )
}

export default SubUsersPost
