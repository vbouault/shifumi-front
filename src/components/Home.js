import React, { useState, useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import AuthContext from '../authContext';
import GameCard from './GameCard';
import { Redirect } from 'react-router-dom';
import socketIOClient from 'socket.io-client';

const Home = () => {

  const { userIdFromToken } = useContext(AuthContext);
  const [games, setGames] = useState()
  const [redirect, setRedirect] = useState(false)
  const [newGameId, setNewGameId] = useState()
  const [socket, setSocket] = useState(null)


  useEffect(() => {
    const socket = socketIOClient(process.env.REACT_APP_API_BASE_URL)
    setSocket(socket)
    socket.on('GameList', (games) => {
      setGames(games)
    });
    socket.on('reloadGames', (newGame) => {
      setGames((games) => [...games, newGame])
    });
    socket.on('reloadGamesUpdate', (game) => {
      setGames((games) => games.filter(g => g.id !== game.id))
    });
  }, [])

  const handleCreateGame = () => {
    socket.emit('newGame', {
      id_user1 : userIdFromToken
    })
    socket.on('reloadGames', (newGame) => {
      setNewGameId(newGame.id)
      setRedirect(true)
    });
  }

  if(redirect){
    return (
      <Redirect to={`/game/${newGameId}`} />
    )
  } else {
    return (
      <>
        <div>
          {games && games.length !== 0 ? games.map(game => <GameCard game={game} key={game.id}/>) : <h3>Pas de partie en cours</h3>}
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
