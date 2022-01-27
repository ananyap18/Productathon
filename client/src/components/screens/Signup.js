import React, {useState, useContext} from 'react'
import './Form.css'
import {UserContext} from '../../App'
import {LoginStatusContext} from '../Hooks/LoginStatusContext'
import {useHistory} from 'react-router-dom'
import {Link} from 'react-router-dom'

function Signup() {
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  const { setIsLoggedIn} = useContext(LoginStatusContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [companyLink, setCompanyLink] = useState('')
  const [bio, setBio] = useState('')
  const [image, setImage] = useState()
  const [imageURL, setImageURL] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUDeQ0UC4TH-VQn1gDp7HjwAPQvHiQvYHezg&usqp=CAU')  

  const avatarDetails = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("file", image)
    formData.append("cloud_name", "ananya-cloudinary")  
    formData.append("upload_preset", "social-media-app")  
    try{
      const res = await fetch('https://api.cloudinary.com/v1_1/ananya-cloudinary/image/upload', {
        method: "POST",
        body: formData
      })
      const JSONres = await res.json()
      submitHandler(JSONres.url)
      setImageURL(JSONres.url)
    }catch(e){
      console.log(e)
    }
  }  

  const submitHandler = async (imgURL) => {
    const emailError = document.querySelector('.email.error')
    const passwordError = document.querySelector('.password.error')
    try {
  // send backend req with nickname, email & password
      const res = await fetch('/signup', { 
        method: 'POST', 
        body: JSON.stringify({ email, password, nickname, companyLink, bio }),
        headers: {'Content-Type': 'application/json'}
      });
      const data = await res.json();
  // send backend request with avatar
      const res2 = await fetch('/updateAvatar', {
        method:'PUT',
        body: JSON.stringify({
          avatarURL: imgURL
        }), headers: {
          'Content-Type': 'application/json'
        }
      })
      const JSONdata = await res2.json()      
      const dataAfterSecondReq = JSONdata.updatedUser
      console.log(dataAfterSecondReq)
      if (data.errors) {
        emailError.textContent = data.errors.email;
        passwordError.textContent = data.errors.password;
      }
      // user present => update state
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(dataAfterSecondReq))        
        dispatch({type: "USER", payload: dataAfterSecondReq})
        setIsLoggedIn(true)
        history.push('/')
        console.log("user state", state)
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  const nicknameHandler = (e) => {
    setNickname(e.target.value)
  }

  const emailHandler = (e) => {
    setEmail(e.target.value)
  }

  const passwordHandler = (e) => {
    setPassword(e.target.value)
  }

  const fileHandler = (e) => {
    setImage(e.target.files[0])
  }  

  const companyLinkHandler = (e) => {
    setCompanyLink(e.target.value)
  }

  const bioChangeHandler = (e) => {
    setBio(e.target.value)
  }

  return (
  <>
  <form onSubmit={avatarDetails}>
  <h2>Sign up</h2>
  <label htmlFor="nickname">Company</label>
  <input type="text" required value={nickname} onChange={nicknameHandler}/>
  <label htmlFor="nickname">Shop Link</label>
  <input type="text" required value={companyLink} onChange={companyLinkHandler}/>
  <label htmlFor="nickname">About you</label>
  <input type="text" required value={bio} onChange={bioChangeHandler}/>
  <label htmlFor="email">Email</label>
  <input type="text" required value={email} onChange={emailHandler}/>
  <div className="email error"></div>
  <label htmlFor="password">Password</label>
  <input type="password" required value={password} onChange={passwordHandler}/>
  <div className="password error"></div>
  <label htmlFor="post-file">Avatar</label>
  <input type="file" name="post-file" onChange={fileHandler}/>
  <button>Sign up</button>
  <p className="form-p">
    <Link to="/login">Already have an account?</Link>
  </p>
  </form>
  </>
  )
}

export default Signup
