import React, {useState, useContext} from 'react'
import './Form.css'
import {UserContext} from '../../App'
import { LoginStatusContext } from '../Hooks/LoginStatusContext'
import {useHistory} from 'react-router-dom'
import {Link} from 'react-router-dom'

function Login() {
  const history = useHistory()
  const {setIsLoggedIn} = useContext(LoginStatusContext)
  const {dispatch} = useContext(UserContext) 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

 const submitHandler = async (e) => {
   e.preventDefault()
   const emailError = document.querySelector('.email.error');
   const passwordError = document.querySelector('.password.error');
   try {
    const response = await fetch('/login', { 
      method: 'POST', 
      body: JSON.stringify({ email, password }),
      headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();  
    if (data.errors) {
      emailError.textContent = data.errors.email;
      passwordError.textContent = data.errors.password;
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user))
      dispatch({type:"USER", payload: data.user})      
      setIsLoggedIn(true)
      history.push('/')
    }
  }
  catch (err) {
    console.log(err);
  }
 }  

  const emailHandler = (e) => {
    setEmail(e.target.value)
  }

  const passwordHandler = (e) => {
    setPassword(e.target.value)
  }  

  return (
  <>
  <form onSubmit={submitHandler}>
  <h2>Login</h2>
  <label htmlFor="email">Email</label>
  <input type="text"  required value = {email} onChange={emailHandler}/>
  <div className="email error"></div>
  <label htmlFor="password">Password</label>
  <input type="password" name="password" required value={password} onChange={passwordHandler}/>
  <div className="password error"></div>
  {/* <div><a href="/forget-password"><Link to="/forgetPassword">Forgot Password</Link></a></div> */}
  <button>login</button>
  <p className="form-p">
    <Link to="/signup">Don't have an account?</Link>
  </p>
  </form>
  </>
  )
}

export default Login
