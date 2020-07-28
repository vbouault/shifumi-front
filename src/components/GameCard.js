import React, { useState, useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { Redirect } from "react-router-dom";
import AuthContext from '../authContext';
import socketIOClient from 'socket.io-client';

const GameCard = ({ game }) => {

  const { userIdFromToken } = useContext(AuthContext);
  const [redirect, setRedirect] = useState(false)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socket = socketIOClient(process.env.REACT_APP_API_BASE_URL)
    setSocket(socket)
  }, [])

  const handleJoinExistGame = () => {
    socket.emit('updateGame', {
      id : game.id,
      id_user2 : userIdFromToken
    })
    setRedirect(true)
  }

  if(redirect){
    return (
      <Redirect to={`/game/${game.id}`} />
    )
  } else {
    return (
      <div className='game-card'>
        <h2>Partie de {game.name}</h2>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className='button-game-card'
          onClick={handleJoinExistGame}
        >
          GO
        </Button>
      </div>
    )
  }
}

export default GameCard
