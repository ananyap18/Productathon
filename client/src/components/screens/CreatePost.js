import React, {useState, useEffect} from 'react'
import './Form.css'

function CreatePost() {
  const [alert, setAlert] = useState(false)
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('')
  const [image, setImage] = useState()
  const [imageURL, setImageURL] = useState('https://i.pinimg.com/originals/58/a2/2b/58a22b10abdfd9e34a39c47bdde1480f.jpg')

  const postDetails = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("file", image)
    formData.append("cloud_name", "ananya-cloudinary")  
    formData.append("upload_preset", "social-media-app")  
    fetch('https://api.cloudinary.com/v1_1/ananya-cloudinary/image/upload', {
        method: "POST",
        body: formData
      })
      .then(res => res.json())
      .then(JSONres => {
        setImageURL(JSONres.url)
        submitPost(JSONres.url)
      })
      .catch(e => console.log(e)) 
  }

  const postTitleHandler = (e) => {
    setPostTitle(e.target.value)
  }
  const postBodyHandler = (e) => {
    setPostBody(e.target.value)
  }

  const submitPost = async(postURL) => {
    try{
      const res = await fetch('/createpost', {
        method:'POST',
        body: JSON.stringify({
          title: postTitle,
          body: postBody,
          photoLink: postURL
        }), headers: {
          'Content-Type': 'application/json'
        }
      })
      const JSONdata = await res.json()
      setAlert(true)
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlert(false)
    }, 2000)
    return () => clearTimeout(timeout)
  }, [alert])


  const fileHandler = (e) => {
    setImage(e.target.files[0])
  }

  return (
    <div>
      <form onSubmit={postDetails}>
      <h2>Post</h2>
        <label htmlFor="post-title">Title</label>
        <input type="text" value={postTitle} onChange={postTitleHandler}/>
      
        <label htmlFor="post-body" >Body</label>
        <input type="text" value={postBody} onChange={postBodyHandler}/>
       
        <label htmlFor="post-file">Image</label>
        <input type="file" name="post-file" onChange={fileHandler}/>
  
        <button>Create Post</button>
        <div class="email error">
          {alert && "post uploaded"}
        </div>
      </form>
    </div>
  )
}

export default CreatePost
