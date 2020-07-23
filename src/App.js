import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Game from './components/Game';
import AuthContext from './authContext';
import jwtDecode from 'jwt-decode';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'))

  const setTokenInLocalStorage = (token) => {
    localStorage.setItem('authToken', token)
    setToken(token)
  }

  let userNameFromToken = null
  let userIdFromToken = null
  if (token) {
    userNameFromToken = jwtDecode(token).name || null;
    userIdFromToken = jwtDecode(token).id || null;
  }
  console.log(window.location)
  return (
    <AuthContext.Provider value={{ token, setToken: setTokenInLocalStorage, userIdFromToken, userNameFromToken }}>
      <Router>
        <div className="App">
          <AppBar position="static" className='navbar-container' >
              {/* <Button variant="contained" color="primary" onClick={() => setTokenInLocalStorage('')}> Deconnexion</Button> */}
              <h2 className='title-navbar'>Shifumi</h2>
          </AppBar>
          <div className="main">
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <PrivateRoute exact path="/">
                <Home />
              </PrivateRoute>
              <PrivateRoute path="/game/:id" component={(props) => <Game {...props} />} />
            </Switch>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
