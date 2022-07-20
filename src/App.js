import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from "react";
import * as gameService from './services/gameService';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Login from './components/Login/Login'
import Register from './components/Register/Register';
import Create from './components/Create/Create';
import Edit from './components/Edit/Edit';
import Details from './components/Details/Details';
import Catalogue from './components/Catalogue/Catalogue';
import './App.css';



function App() {
  const [games, setGames] = useState([]);

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
        <Route path="/" element={<Home games={games}/>} />
        {/* Login Page ( Only for Guest users ) */}
        <Route path='/login' element={<Login />} />
        {/* Register Page ( Only for Guest users ) */}
        <Route path='/register' element={<Register />} />
        {/* Create Page ( Only for logged-in users ) */}
        <Route path='/create' element={<Create />} />
        {/* Edit Page ( Only for the creator )*/}
        <Route path='/edit' element={<Edit />} />
        {/*Details Page*/}
        <Route path='/details' element={<Details />} />
        {/* Catalogue */}
        <Route path='/catalog' element={<Catalogue games={games} />} />
      </Routes>

    </div>

  );
}

export default App;
