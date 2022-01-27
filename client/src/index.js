import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {LoginStatusProvider} from './components/Hooks/LoginStatusContext'

ReactDOM.render(
  <React.StrictMode>
    <LoginStatusProvider>
    <App />
    </LoginStatusProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


