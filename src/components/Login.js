import React, { useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AuthContext from '../authContext';
import API from '../API';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Redirect } from 'react-router-dom';

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

  const [messageForm, setMessageForm] = useState(false);
  const [msgAlert, setMsgAlert] = useState('');
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [login, setLogin] = useState({
    email: '',
    password: ''
  })
  const [register, setRegister] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [validPassword, setValidPassword] = useState('');
  const { token, setToken } = useContext(AuthContext);

  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  }

  const handleCloseMui = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMessageForm(false);
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault()
    API.post('/auth/login', login)
      .then(res => res.data)
      .then((data) => {
        setToken(data.token)
      })
      .catch(err => {
        console.error(err);
      })
  }

  const handleSubmitRegister = (e) => {
    e.preventDefault()
    if (register.password !== validPassword) {
      setMessageForm(true)
      setErrorForm(true)
      setMsgAlert('Les mots de passe ne correspondent pas.');
    } else {
      setLoading(true);
      API.post('/users', register)
        .then(() => {
          setMessageForm(true)
          setErrorForm(false)
          setMsgAlert('Votre inscription à réussi, vous pouvez vous connecter')
          setLoading(false)
          setRegister({
            name: '',
            email: '',
            password: ''
          })
          setValidPassword('')
        })
        .catch(err => {
          const errorMessage = err.response.data.errorMessage;
          if (errorMessage === 'Email already used') {
            setMsgAlert('Cet e-mail est déjà utilisé par un autre utilisateur.');
          } else {
            setMsgAlert('Une erreur est survenue, veuillez essayer à nouveau.');
          }
          setErrorForm(true);
          setLoading(false);
          setMessageForm(true);
        })
    }
  }

if (!!token) {
  return (
    <Redirect
      to={{
        pathname: "/"
      }}
    />
  )
} else {
  return (
    <>
      <div className='login-page'>
        <h2>Connexion</h2>
        <form className='form-login' onSubmit={e => handleSubmitLogin(e)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
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
      <div>
        <h2>Inscription</h2>
        <form className='form-register' onSubmit={e => handleSubmitRegister(e)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="pseudo"
            name="name"
            autoComplete="name"
            autoFocus
            value={register.name}
            onChange={(e) => setRegister({ ...register, name: e.target.value })}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Adresse email"
            name="email"
            autoComplete="email"
            autoFocus
            value={register.email}
            onChange={(e) => setRegister({ ...register, email: e.target.value })}
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
            value={register.password}
            onChange={(e) => setRegister({ ...register, password: e.target.value })}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Valider le mot de passe"
            type="password"
            id="password"
            autoComplete="current-password"
            value={validPassword}
            onChange={(e) => setValidPassword(e.target.value)}
          />
          {loading ?
            <CircularProgress className='loader' style={{ width: '70px', height: '70px' }} />
            :
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Inscription
              </Button>}
        </form>
      </div>
      <Snackbar open={messageForm} autoHideDuration={6000} onClose={handleCloseMui}>
        <Alert onClose={handleCloseMui} severity={!errorForm ? 'success' : 'error'}>
          {msgAlert}
        </Alert>
      </Snackbar>
    </>
  )
}
}

export default Login
