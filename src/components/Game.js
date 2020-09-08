import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../authContext';
import socketIOClient from 'socket.io-client';
import pierre from '../images/pierre.png';
import feuille from '../images/feuille.png';
import ciseaux from '../images/ciseaux.png';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const delay = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));


const Game = (props) => {
  const id = props.match.params.id;
  const { userNameFromToken } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [dataGame, setDataGame] = useState();
  const [selectedObjectUser1, setSelectedObjectUser1] = useState();
  const [selectedObjectUser2, setSelectedObjectUser2] = useState();
  const [pointUser1, setPointUser1] = useState();
  const [pointUser2, setPointUser2] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [winMessage, setWinMessage] = useState('');
  const [endGameMessageUser1, setEndGameMessageUser1] = useState('');
  const [endGameMessageUser2, setEndGameMessageUser2] = useState('');

  useEffect(() => {
    const socket = socketIOClient(process.env.REACT_APP_API_BASE_URL)
    setSocket(socket)
    socket.emit('dataGame', id)
    socket.on('reloadDataGame', (game) => {
      setDataGame(game)
    });
    socket.on('reloadObject', (data) => {
      if (data.selectedObjectUser1 || data.selectedObjectUser1 === '') {
        setSelectedObjectUser1(data.selectedObjectUser1)
        if (data.pointUser1) {
          setPointUser1(data.pointUser1)
        }
      } else if (data.selectedObjectUser2 || data.selectedObjectUser2 === '') {
        setSelectedObjectUser2(data.selectedObjectUser2)
        if (data.pointUser2) {
          setPointUser2(data.pointUser2)
        }
      }
    });
  }, [])

  useEffect(() => {
    if (dataGame) {
      setCurrentUser(userNameFromToken === dataGame.name2 ? 'user2' : 'user1')
      setPointUser1(dataGame.point_user1)
      setPointUser2(dataGame.point_user2)
    }
  }, [dataGame])


  const winVerify = async () => {
    let winMessageCopy = '';
    if (currentUser === 'user1' && selectedObjectUser1 && selectedObjectUser2) {
      if (selectedObjectUser1 === selectedObjectUser2) {
        winMessageCopy = 'égalité';
      } else if (selectedObjectUser1 === 'feuille' && selectedObjectUser2 === 'ciseaux') {
        winMessageCopy = 'Perdu';
      } else if (selectedObjectUser1 === 'ciseaux' && selectedObjectUser2 === 'feuille') {
        winMessageCopy = 'Gagné';
      } else if (selectedObjectUser1 === 'ciseaux' && selectedObjectUser2 === 'pierre') {
        winMessageCopy = 'Perdu';
      } else if (selectedObjectUser1 === 'pierre' && selectedObjectUser2 === 'ciseaux') {
        winMessageCopy = 'Gagné';
      } else if (selectedObjectUser1 === 'pierre' && selectedObjectUser2 === 'feuille') {
        winMessageCopy = 'Perdu';
      } else if (selectedObjectUser1 === 'feuille' && selectedObjectUser2 === 'pierre') {
        winMessageCopy = 'Gagné';
      }
      setWinMessage(winMessageCopy)
      await delay(2000)
      socket.emit('object', { selectedObjectUser1: '', id, currentUser, pointUser1: winMessageCopy === 'Gagné' ? pointUser1 + 1 : pointUser1 })
      setWinMessage('')
      setSelectedObjectUser1('')
      setSelectedObjectUser2('')
    } else if (currentUser === 'user2' && selectedObjectUser1 && selectedObjectUser2) {
      if (selectedObjectUser1 === selectedObjectUser2) {
        winMessageCopy = 'égalité';
      } else if (selectedObjectUser2 === 'feuille' && selectedObjectUser1 === 'ciseaux') {
        winMessageCopy = 'Perdu';
      } else if (selectedObjectUser2 === 'ciseaux' && selectedObjectUser1 === 'feuille') {
        winMessageCopy = 'Gagné';
      } else if (selectedObjectUser2 === 'ciseaux' && selectedObjectUser1 === 'pierre') {
        winMessageCopy = 'Perdu';
      } else if (selectedObjectUser2 === 'pierre' && selectedObjectUser1 === 'ciseaux') {
        winMessageCopy = 'Gagné';
      } else if (selectedObjectUser2 === 'pierre' && selectedObjectUser1 === 'feuille') {
        winMessageCopy = 'Perdu';
      } else if (selectedObjectUser2 === 'feuille' && selectedObjectUser1 === 'pierre') {
        winMessageCopy = 'Gagné';
      }
      setWinMessage(winMessageCopy)
      await delay(2000)
      socket.emit('object', { selectedObjectUser2: '', id, currentUser, pointUser2: winMessageCopy === 'Gagné' ? pointUser2 + 1 : pointUser2 })
      setWinMessage('')
      setSelectedObjectUser1('')
      setSelectedObjectUser2('')
    }
  }

  const endGameVerify = () => {
    if (pointUser1 >= 3) {
      setEndGameMessageUser1('Bravo, vous avez gagné !')
      setEndGameMessageUser2('Dommage, vous avez perdu !')
    } else if (pointUser2 >= 3) {
      setEndGameMessageUser2('Bravo, vous avez gagné !')
      setEndGameMessageUser1('Dommage, vous avez perdu !')
    }
  }

  useEffect(() => {
    winVerify()
  }, [selectedObjectUser2, selectedObjectUser1])

  useEffect(() => {
    endGameVerify()
  }, [pointUser1, pointUser2])


  const handleClick = (e) => {
    if (currentUser === 'user1' && !selectedObjectUser1) {
      socket.emit('object', { selectedObjectUser1: e.target.name, id, currentUser })
      setSelectedObjectUser1(e.target.name)
    } else if (currentUser === 'user2' && !selectedObjectUser2) {
      socket.emit('object', { selectedObjectUser2: e.target.name, id, currentUser })
      setSelectedObjectUser2(e.target.name)
    }
  }
  if (!dataGame) {
    return (
      <div className='game-finish-container'>
        <h3>En attente d'un adversaire...</h3>
      </div>
    )
  } else if (endGameMessageUser1) {
    return (
      <div className='game-finish-container'>
        {currentUser === 'user1' ? <h2>{endGameMessageUser1}</h2> : <h2>{endGameMessageUser2}</h2>}
        <Button type="submit" fullWidth variant="contained" color="primary"><Link className='button-back-home' to='/'>Retour à l'accueil</Link></Button>
      </div>
    )
  } else {
    return (
      <div className='game-page-container'>
        <div>
          {dataGame && (userNameFromToken === dataGame.name2 ? <div className='game_pseudo'><h2>{dataGame.name1}</h2></div> : <div className='game_pseudo'><h2>{dataGame.name2}</h2></div>)}
          {dataGame && (userNameFromToken === dataGame.name2 ? <div className='game-point'><p>{pointUser1}</p></div> : <div className='game-point'><p>{pointUser2}</p></div>)}
        </div>
        {(selectedObjectUser1 && selectedObjectUser2) ? <div className='reveal-object'>
          {currentUser === 'user1' ?
            <>
              <img src={selectedObjectUser2 === 'pierre' ? pierre : selectedObjectUser2 === 'feuille' ? feuille : ciseaux} alt={selectedObjectUser2} className='image-game-center' />
              <h3>{winMessage}</h3>
              <img src={selectedObjectUser1 === 'pierre' ? pierre : selectedObjectUser1 === 'feuille' ? feuille : ciseaux} alt={selectedObjectUser1} className='image-game-center' />
            </>
            :
            <>
              <img src={selectedObjectUser1 === 'pierre' ? pierre : selectedObjectUser1 === 'feuille' ? feuille : ciseaux} alt={selectedObjectUser1} className='image-game-center' />
              <h3>{winMessage}</h3>
              <img src={selectedObjectUser2 === 'pierre' ? pierre : selectedObjectUser2 === 'feuille' ? feuille : ciseaux} alt={selectedObjectUser2} className='image-game-center' />
            </>
          }
        </div> :
          (currentUser === 'user1' && selectedObjectUser1) || (currentUser === 'user2' && selectedObjectUser2) ?
            <h3>en attente de votre adversaire</h3> :
            (currentUser === 'user1' && selectedObjectUser2) || (currentUser === 'user2' && selectedObjectUser1) ?
              <h3>Votre adversaire à choisi, c'est à vous</h3> :
              <h3>Let's go !</h3>
        }
        <div className='image-name-container'>
          {selectedObjectUser2 && (userNameFromToken === dataGame.name2) &&
            <div>Vous avez choisi <img src={selectedObjectUser2 === 'pierre' ? pierre : selectedObjectUser2 === 'feuille' ? feuille : ciseaux} alt={selectedObjectUser2} className='image-game-small' /></div>}
          {selectedObjectUser1 && (userNameFromToken === dataGame.name1) &&
            <div>Vous avez choisi <img src={selectedObjectUser1 === 'pierre' ? pierre : selectedObjectUser1 === 'feuille' ? feuille : ciseaux} alt={selectedObjectUser1} className='image-game-small' /></div>}
          {dataGame && (userNameFromToken === dataGame.name2 ? <div className='game-point'><p>{pointUser2}</p></div> : <div className='game-point'><p>{pointUser1}</p></div>)}
          <div className='game_pseudo'><h2>{userNameFromToken}</h2></div>
          <div className='image-container'>
            <img src={pierre} alt='pierre' name='pierre' className='image-game' onClick={(e) => handleClick(e)} />
            <img src={feuille} alt='feuille' name='feuille' className='image-game' onClick={(e) => handleClick(e)} />
            <img src={ciseaux} alt='ciseaux' name='ciseaux' className='image-game' onClick={(e) => handleClick(e)} />
          </div>
        </div>
      </div>
    )
  }
}

export default Game
