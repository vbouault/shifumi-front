import React, { useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AuthContext from '../authContext';
import API from '../API';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const classes = useStyles();

  const [login, setLogin] = useState({
    email : '',
    password : ''
  })
  const { setToken } = useContext(AuthContext)

  const handleSubmitLogin = (e) => {
    e.preventDefault()
    API.post('/auth/login', login)
      .then(res => res.data)
      .then((data) => {
        setToken(data.token)
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <div>
      <h2>Connexion</h2>
      <form className='form-login' onSubmit={e => handleSubmitLogin(e)}>
      <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse email"
              name="email"
              autoComplete="email"
              autoFocus
              value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Connexion
            </Button>
      </form>
    </div>
  )
}

export default Login
