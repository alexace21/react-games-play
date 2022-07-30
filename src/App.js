import { Route, Routes, useNavigate } from 'react-router-dom';
import { lazy, useEffect, useState, Suspense } from "react";
import { GameContex } from './context/GameContext';

import * as gameService from './services/gameService';
import AuthContext from './context/AuthContext';

import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Login from './components/Login/Login'
import Logout from './components/Login/Logout'
import Create from './components/Create/Create';
import Edit from './components/Edit/Edit';
import Details from './components/Details/Details';
import Catalogue from './components/Catalogue/Catalogue';
import './App.css';
import { useLocalStorage } from './hooks/useLocalStorage';


const Register = lazy(() => import('./components/Register/Register'))

function App() {
  const [games, setGames] = useState([]);
  const [auth, setAuth] = useLocalStorage('auth', {});

  const navigate = useNavigate();

  const userLoginHandler = (authData) => {
    setAuth(authData);
  };

  const userLogout = () => {
    setAuth({});
  };

  // return new state with the same games however + the new game with its new comments
  const addComment = (gameId, comment) => {
    setGames(state => {
      const game = state.find(x => x._id == gameId);
      const comments = game.comments || [];
      comments.push(comment)

      return [
        ...state.filter(x => x._id !== gameId),
        { ...game, comments }
      ]
    })
  };

  const addGameHandler = (gameData) => {
    setGames(state =>
      [...state,
        gameData
      ]);

    navigate('/catalog')
  };

  useEffect(() => {
    gameService.getAll()
      .then(result => {
        setGames(result);
      })
  }, []);

  const gameEdit = (gameId, gameData) => {
    setGames(state => state.map(x => x._id === gameId ? gameData : x))
  }

  return (
    <AuthContext.Provider value={{ user: auth, userLoginHandler, userLogout }}>
      <div id="box">
        {/* Navigation */}
        <Header />
        {/* Main Content */}
        <GameContex.Provider value={{games, addGameHandler, addComment, gameEdit}}>
          <main id="main-content">

            <Routes>
              {/*Home Page*/}
              <Route path="/" element={<Home games={games} />} />
              {/* Login Page ( Only for Guest users ) */}
              <Route path='/login' element={<Login />} />
              {/* Register Page ( Only for Guest users ) */}
              <Route path='/register' element=
                {
                  <Suspense fallback={<span>Loading...</span>}>
                    <Register />
                  </Suspense>
                } />
              <Route path='/logout' element={<Logout />} />
              {/* Create Page ( Only for logged-in users ) */}
              <Route path='/create' element={<Create />} />
              {/* Edit Page ( Only for the creator )*/}
              <Route path='/games/:gameId/edit' element={<Edit />} />
              {/*Details Page*/}
              <Route path='/catalog/:gameId' element={<Details />} />
              {/* Catalogue */}
              <Route path='/catalog' element={<Catalogue />} />
            </Routes>
          </main>
        </GameContex.Provider>

      </div>
    </AuthContext.Provider>
  );
}

export default App;
