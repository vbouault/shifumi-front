import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../authContext';
import socketIOClient from 'socket.io-client';
import pierre from '../images/pierre.png';
import feuille from '../images/feuille.png';
import ciseaux from '../images/ciseaux.png';

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

  useEffect(() => {
    const socket = socketIOClient('http://localhost:3000')
    setSocket(socket)
    socket.emit('dataGame', id)
    socket.on('reloadDataGame', (game) => {
      setDataGame(game)
    });
    socket.on('reloadObject', (data) => {
      if (data.selectedObjectUser1 || data.selectedObjectUser1 === '') {
        setSelectedObjectUser1(data.selectedObjectUser1)
        if(data.pointUser1) {
          setPointUser1(data.pointUser1)
        }
      } else if (data.selectedObjectUser2 || data.selectedObjectUser2 === '') {
        setSelectedObjectUser2(data.selectedObjectUser2)
        if(data.pointUser2) {
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
      await delay(5000)
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
      await delay(5000)
      socket.emit('object', { selectedObjectUser2: '', id, currentUser, pointUser2: winMessageCopy === 'Gagné' ? pointUser2 + 1 : pointUser2 })
      setWinMessage('')
      setSelectedObjectUser1('')
      setSelectedObjectUser2('')
    }
  }

  useEffect(() => {
    winVerify()
  }, [selectedObjectUser2, selectedObjectUser1])


  const handleClick = (e) => {
    if (currentUser === 'user1' && !selectedObjectUser1) {
      socket.emit('object', { selectedObjectUser1: e.target.name, id, currentUser })
      setSelectedObjectUser1(e.target.name)
    } else if (currentUser === 'user2' && !selectedObjectUser2) {
      socket.emit('object', { selectedObjectUser2: e.target.name, id, currentUser })
      setSelectedObjectUser2(e.target.name)
    }
  }

  return (
    <div className='game-page-container'>
      <div>
        {dataGame && (userNameFromToken === dataGame.name2 ? <h2>{dataGame.name1}</h2> : <h2>{dataGame.name2}</h2>)}
        {dataGame && (userNameFromToken === dataGame.name2 ? <div>{pointUser1}</div> : <div>{pointUser2}</div>)}
      </div>
      {(selectedObjectUser1 && selectedObjectUser2) && <div className='reveal-object'>
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
      </div>}
      <div className='image-name-container'>
      {dataGame && (userNameFromToken === dataGame.name2 ? <div>{pointUser2}</div> : <div>{pointUser1}</div>)}
        <h2>{userNameFromToken}</h2>
        <div className='image-container'>
          <img src={pierre} alt='pierre' name='pierre' className='image-game' onClick={(e) => handleClick(e)} />
          <img src={feuille} alt='feuille' name='feuille' className='image-game' onClick={(e) => handleClick(e)} />
          <img src={ciseaux} alt='ciseaux' name='ciseaux' className='image-game' onClick={(e) => handleClick(e)} />
        </div>
      </div>
    </div>
  )
}

export default Game
