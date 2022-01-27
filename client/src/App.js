import React, { useReducer } from 'react'
import './App.css';
import Navbar from './components/utils/Navbar';
import {BrowserRouter as Router } from 'react-router-dom'
import Routes from './components/utils/Routes';
import { initialState, reducerFunc } from './components/Hooks/UserReducer';

export const UserContext = React.createContext()

function App() {
  const [state, dispatch] = useReducer(reducerFunc, initialState)

  return (
    <UserContext.Provider value={{state, dispatch}}>
      <div className="App">
      <Router>
        <Navbar />
        <Routes />
      </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;
