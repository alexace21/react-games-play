import { Route, Routes, useNavigate } from 'react-router-dom';
import { lazy, useEffect, useState, Suspense } from "react";
import * as gameService from './services/gameService';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Login from './components/Login/Login'
import Create from './components/Create/Create';
import Edit from './components/Edit/Edit';
import Details from './components/Details/Details';
import Catalogue from './components/Catalogue/Catalogue';
import uniqid from 'uniqid';
import './App.css';


const Register = lazy(() => import('./components/Register/Register'))

function App() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

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
      {
        ...gameData,
        _id: uniqid()
      }
      ]);

    navigate('/catalog')
  };

  useEffect(() => {
    gameService.getAll()
      .then(result => {
        setGames(result);
      })
  }, []);

  return (
    <div id="box">
      {/* Navigation */}
      <Header />
      {/* Main Content */}
      <main id="main-content"></main>

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
        {/* Create Page ( Only for logged-in users ) */}
        <Route path='/create' element={<Create addGameHandler={addGameHandler} />} />
        {/* Edit Page ( Only for the creator )*/}
        <Route path='/edit' element={<Edit />} />
        {/*Details Page*/}
        <Route path='/catalog/:gameId' element={<Details games={games} addComment={addComment} />} />
        {/* Catalogue */}
        <Route path='/catalog' element={<Catalogue games={games} />} />
      </Routes>

    </div>

  );
}

export default App;
