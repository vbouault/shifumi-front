import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Game from './components/Game';
import AuthContext from './authContext';
import jwtDecode from 'jwt-decode';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from './PrivateRoute';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'))

  const setTokenInLocalStorage = (token) => {
    localStorage.setItem('authToken', token)
    setToken(token)
  }

  let userNameFromToken = null
  if (token) {
    userNameFromToken = jwtDecode(token).name || null
  }

  return (
    <AuthContext.Provider value={{token, setToken: setTokenInLocalStorage}}>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <PrivateRoute exact path="/">
              <Home />
            </PrivateRoute>
            <PrivateRoute path="/game/:id" component={(props) => <Game {...props}/>} />
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
