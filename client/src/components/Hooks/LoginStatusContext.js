import React, {useState} from 'react'

export const LoginStatusContext = React.createContext()

export const LoginStatusProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return(
    <LoginStatusContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
      {props.children}
    </LoginStatusContext.Provider>
  )
}
