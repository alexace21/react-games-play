import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from "react";

import { GameProvider } from './context/GameContext';
import { AuthProvider } from './context/AuthContext';

import PrivateRoute from './components/Common/PrivateRoute';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Login from './components/Login/Login'
import Logout from './components/Login/Logout'
import Create from './components/Create/Create';
import Edit from './components/Edit/Edit';
import Details from './components/Details/Details';
import Catalogue from './components/Catalogue/Catalogue';
import './App.css';
import PrivateGuard from './components/Common/PrivateGuard';



const Register = lazy(() => import('./components/Register/Register'))

function App() {

  return (
    <AuthProvider>
      <div id="box">
        {/* Navigation */}
        <Header />
        {/* Main Content */}
        <GameProvider >
          <main id="main-content">

            <Routes>
              {/*Home Page*/}
              <Route path="/" element={<Home />} />
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
              <Route path='/create' element={
                <PrivateRoute>
                  <Create />
                </PrivateRoute>}
              />
              <Route element={<PrivateGuard />}>

                <Route path='/logout' element={<Logout />} />
                {/* Edit Page ( Only for the creator )*/}
                <Route path='/games/:gameId/edit' element={<Edit />} />

              </Route>
              {/*Details Page*/}
              <Route path='/catalog/:gameId' element={<Details />} />
              {/* Catalogue */}
              <Route path='/catalog' element={<Catalogue />} />
            </Routes>
          </main>
        </GameProvider>
      </div>
    </AuthProvider>
  );
}

export default App;
