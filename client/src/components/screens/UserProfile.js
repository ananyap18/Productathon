import React, { useState, useEffect, useContext } from "react"
import Modal from "react-modal"
import "./Profile.css"
import Post from "../utils/Post"
import { useParams } from "react-router-dom"
import { UserContext } from "../../App"
import StarRating from "../utils/StarRating"

function UserProfile() {
  const { state, dispatch } = useContext(UserContext);
  const { USER_ID } = useParams();
  const [showFollowBtn, setShowFollowBtn] = useState(state ? !state.following.includes(USER_ID) : true)
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [numberOfPosts, setNumberOfPosts] = useState(0)
  const [contactModalIsOpen, setContactModalIsOpen] = useState(false)
  const [aboutModalIsOpen, setAboutModalIsOpen] = useState(false)
  const [text, setText] = useState('')
  const [alert, setAlert] = useState('')
  const [companyLink, setCompanyLink] = useState('')
  const [bio, setBio] = useState('')

  const getUserPosts = async () => {
    try {
      const response = await fetch(`/profile/${USER_ID}`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      const resJSON = await response.json();
      console.log("UserProfile.js", resJSON)
      setUserPosts(resJSON.posts);
      setNumberOfPosts(resJSON.posts.length)
      setUserInfo(resJSON.user);
    } catch (e) {
      console.log(e);
    }
  };

  const getUserInfo = async () => {
    try{
      const response = await fetch(`/profile/${USER_ID}`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        }
      })
      const JSONres = await response.json()
      
      setCompanyLink(JSONres.user.companyLink)
      setBio(JSONres.user.bio)
      console.log(companyLink, bio)
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    getUserPosts()
    getUserInfo()
  }, []);

  const followUser = async () => {
    try {
      const response = await fetch("/follow", {
        method: "PATCH",
        body: JSON.stringify({ followId: USER_ID }),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      const resJSON = await response.json();
      dispatch({
        type: "UPDATE",
        payload: {
          following: resJSON.userLoggedIn.following,
          followers: resJSON.userLoggedIn.followers,
        }
      });
      setUserInfo(resJSON.userToFollow)
      localStorage.setItem('user', JSON.stringify(resJSON.userLoggedIn))
    } catch (e) {
      console.log(e);
    }
  };

  const unfollowUser = async () => {
    try {
      const response = await fetch("/unfollow", {
        method: "PATCH",
        body: JSON.stringify({ followId: USER_ID }),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      const resJSON = await response.json();
      dispatch({
        type: "UPDATE",
        payload: {
          following: resJSON.userLoggedIn.following,
          followers: resJSON.userLoggedIn.followers,
        },
      });
      setUserInfo(resJSON.userToUnfollow)
      localStorage.setItem('user', JSON.stringify(resJSON.userLoggedIn))
    } catch (e) {
      console.log(e);
    }
  };

  const textInputHandler = (e) => {
    setText(e.target.value)
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`/sendMessage/${USER_ID}`, {
        method: "POST",
        body: JSON.stringify({
          body: text,
        }),
        headers: {
          "Content-Type": "application/json",
        }
      })
      const newMessageId = await response.json()
      console.log(newMessageId)
      setText('')
      setAlert('message has been sent')
    } catch (e) {
      console.log(e)
    }
  }

  const userPostsToRender = userPosts.map(userPost => <Post key={userPost._id} post={userPost} />)

  return (
    <>
      <div className="about">
        <div className="avatar">
          <img
            src={(userInfo.avatar === "no pic") ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUDeQ0UC4TH-VQn1gDp7HjwAPQvHiQvYHezg&usqp=CAU" : userInfo.avatar}
            alt="avatar-img"
          />
        </div>
        <div className="details">
          <h3>{(userInfo) ? userInfo.nickname : "loading"}</h3>

          <p style={{ paddingTop: "10px" }}>{(userInfo) ? userInfo.email : "loading"}</p>

          <p style={{ paddingTop: "10px" }} onClick={() => {
            setContactModalIsOpen(true)
          }} className="modal-btn">contact us</p>

          <p style={{ paddingTop: "10px" }} onClick={() => {
            setAboutModalIsOpen(true)
          }} className="modal-btn">about us</p>

          <div>
            <h5>{numberOfPosts} posts</h5>
            <h5>
              {userInfo.followers ? userInfo.followers.length : "0"} followers
            </h5>
            <h5>
              {userInfo.following ? userInfo.following.length : "0"} following
            </h5>
          </div>
          <p style={{paddingTop:"15px", fontWeight: "bold"}}>Rate me!</p> 
            <div className="rating">
            <StarRating />
          </div> 
          {showFollowBtn ? <button onClick={() => { followUser(); setShowFollowBtn(!showFollowBtn) }}>Follow </button> : <button onClick={() => { unfollowUser(); setShowFollowBtn(!showFollowBtn) }} > Unfollow </button>}
        </div>
      </div>
      <div className="gallery">
        <ul className="posts">
          {userPosts.length == 0 ? "No Post Found :(" : userPostsToRender}
        </ul>
      </div>
      <Modal isOpen={contactModalIsOpen}
        onRequestClose={() => setContactModalIsOpen(false)}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        style={{
          content: {
            height: "500px",
            width: "500px",
            // transform: "translate(+125%, +30%)",
            border: "2px solid black"
          }
        }}>
        <p onClick={() => setContactModalIsOpen(false)} style={{ textAlign: "right", fontSize: "20px", paddingBottom: "90px" }} className="modal-btn">
          Close
        </p>
        <form onSubmit={submitHandler}>
          <label style={{ paddingBottom: "30px" }}>Type Your Message Here: </label>
          <input type="text" required value={text} onChange={textInputHandler} />
          {alert != '' && <div className="error">{alert}</div>}
          <button>Send</button>
        </form>
      </Modal>

      <Modal isOpen={aboutModalIsOpen}
        onRequestClose={() => setAboutModalIsOpen(false)}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        style={{
          content: {
            height: "200px",
            width: "700px",
            border: "2px solid black"
          }
        }}>
         <p onClick={() => setAboutModalIsOpen(false)} style={{ textAlign: "right", fontSize: "20px", paddingBottom: "60px" }} className="modal-btn">
          Close
        </p>
        <h3>Here is something you should know about us: </h3>
        {companyLink!=""&&<p><a href={companyLink} target="_blank">Shop Link</a></p>} 
        {bio!=""&&<p>{bio}</p>}
      </Modal>
    </>
  );
}

export default UserProfile;
