import React, {useEffect, useContext}  from 'react'
import Home from '../screens/Home'
import Login from '../screens/Login'
import Profile from '../screens/Profile'
import Signup from '../screens/Signup'
import CreatePost from '../screens/CreatePost';
import LoggedOut from '../screens/LoggedOut'
import UserProfile from '../screens/UserProfile'
import SubUsersPost from '../screens/SubUsersPost'
import ChatForm from '../chat-feature/ChatForm'
import Inbox from '../screens/Inbox'
import { Route, Switch, useHistory } from 'react-router-dom'
import {LoginStatusContext} from '../Hooks/LoginStatusContext'
import {UserContext} from '../../App'

function Routes() {
  const { setIsLoggedIn} = useContext(LoginStatusContext)
  const { dispatch} = useContext(UserContext)   

  const checkLoginStatus = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    if(user){
      dispatch({type: "USER", payload: user})
      setIsLoggedIn(true)
      // redirect to '/'
      history.push('/')
    }else{
      setIsLoggedIn(false)
      // redirect to '/login'
      history.push('/login')
    }
    // note: it is necessary to redirect only after the state is set
  }

  const history = useHistory()

  useEffect(() => {
    checkLoginStatus()    
  }, [])

  return (
    <Switch>
    <Route exact path="/"><Home /></Route>
    <Route exact path="/profile"><Profile/></Route>
    <Route path="/signup"><Signup/></Route>
    <Route path="/login"><Login/></Route>
    <Route path="/createPost"><CreatePost/></Route>
    <Route path="/profile/:USER_ID"><UserProfile/></Route> 
    <Route path="/userSubPost"><SubUsersPost/></Route> 
    <Route path="/chat-room"><ChatForm /></Route>
    <Route path="/inbox"><Inbox/></Route>
    <Route path="/logout"><LoggedOut/></Route>
    </Switch>
  )
}

export default Routes
