import React, {useState, useEffect, useContext} from "react";
import './Profile.css'
import Post from '../utils/Post'
import { UserContext } from "../../App"
import { Link } from "react-router-dom"


function Profile() {
  const {state, dispatch} = useContext(UserContext)
  const [userPosts, setUserPosts] = useState([])
  const [image, setImage] = useState()
  const [imageURL, setImageURL] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUDeQ0UC4TH-VQn1gDp7HjwAPQvHiQvYHezg&usqp=CAU')   
  const [numberOfPosts, setNumberOfPosts] = useState(0)

  const getUserPosts = async () => {
    try{
      const response = await fetch('/myposts', {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }          
      })
      const resJSON = await response.json()
      setUserPosts(resJSON.userPosts)
    }catch(e){
      console.log(e)
    }
  }

  const getUserNumberOfPosts = async () => {
    try {
      const response = await fetch(`/profile/${state._id}`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      const resJSON = await response.json()
      setNumberOfPosts(resJSON.posts.length)

    } catch (e) {
      console.log(e);
    }
  };

  const fileHandler = (e) => {
    console.log("img changed")
    setImage(e.target.files[0])
  }

  const updateAvatar = async (imgURL) => {
    try{
      const res = await fetch('/updateAvatar', {
        method:'PUT',
        body: JSON.stringify({
          avatarURL: imgURL
        }), headers: {
          'Content-Type': 'application/json'
        }
      })
      const JSONdata = await res.json()
      // set payload to updated user   
      dispatch({type:"UPDATEPIC", payload: JSONdata.updatedUser})  
      console.log("updated user's profile to ", JSONdata.updatedUser.avatar)
      localStorage.setItem('user', JSON.stringify(JSONdata.updatedUser)) 
    }catch(e){
      console.log(e)
    }
  }

  useEffect( () => {
    getUserPosts()
    getUserNumberOfPosts()
    console.log(state)
  }, [])

  useEffect(()=> {
    if(image){
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
      updateAvatar(JSONres.url)
      console.log("use effect",JSONres.url)
    }).catch(err=>console.log(err))            
    }
  }, [image]) 

  const userPostsToRender = userPosts.map(userPost =>  <Post key={userPost._id} post={userPost} /> )

  return (
    <>
      <div className="about">
          <div className="avatar">
            <img src={(state)?state.avatar: imageURL} alt="avatar-img" />
          </div>
          <div className="details">
            <h3>{(state)?state.nickname: "loading"}</h3>
            <Link to="/inbox"><p>open my inbox</p></Link>
            <div>
              <h5>{numberOfPosts} posts</h5>
              <h5>{(state)?state.followers.length:"0"} followers</h5>
              <h5>{(state)?state.following.length:"0"} following</h5>
            </div>
            <form> 
            <label htmlFor="post-file">Avatar</label>
            <input type="file" name="post-file" onChange={fileHandler} />
            <button>Change Avatar</button>
            </form>  
          </div>
      </div>
      <div className="gallery">
        <ul className="posts">
          {userPosts.length == 0? "No Post Found :(" : userPostsToRender}
        </ul>
      </div>
    </>
  );
}

export default Profile;
