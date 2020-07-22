import React, { useState, useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import API from '../API';
import { Redirect } from "react-router-dom";
import AuthContext from '../authContext';

const GameCard = ({ game }) => {

  const { userIdFromToken } = useContext(AuthContext);
  const [redirect, setRedirect] = useState(false)

  const handleJoinExistGame = () => {
    API.patch(`/games/${game.id}`, { idUser2 : userIdFromToken })
      .then(() => {
        setRedirect(true)
      })
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
