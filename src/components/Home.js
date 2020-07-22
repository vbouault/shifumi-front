import React, { useState, useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import AuthContext from '../authContext';
import API from '../API';
import GameCard from './GameCard';
import { Redirect } from "react-router-dom";

const Home = () => {

  const { userIdFromToken } = useContext(AuthContext);
  const [games, setGames] = useState()
  const [redirect, setRedirect] = useState(false)
  const [newGameId, setNewGameId] = useState()


  useEffect(() => {
    API.get('/games/notStarted')
      .then(res => res.data)
      .then(data => {
        setGames(data)
      })
  }, [])

  const handleCreateGame = () => {
    API.post(`/games/users/${userIdFromToken}`)
      .then(res => res.data)
      .then(data => {
        setGames([...games, data])
        setNewGameId(data.id)
      })
      .then(() => {
        setRedirect(true)
      })
  }

  if(redirect){
    return (
      <Redirect to={`/game/${newGameId}`} />
    )
  } else {
    return (
      <>
        <div>
          {games && games.map(game => <GameCard game={game} key={game.id}/>)}
        </div>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleCreateGame}
        >
          Nouvelle partie
        </Button>
      </>
    )
  }
}

export default Home
