import { useState } from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import { AuthProvider } from './shared/context/AuthContext.jsx'
import ProtectedRoute from './shared/components/ProtectedRoute.jsx'
import Navbar from './shared/components/Navbar.jsx'

//Auth
import Login    from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';

//Leaderboard
import Leaderboard from './features/Leaderboard/pages/Leaderboard.jsx'

import './App.css'


function App() {

  return (

    <BrowserRouter>
    <AuthProvider>
      <div className="min-h-screen">
        <Navbar/>

        <main>
          <Routes>
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/leaderboard' element={<Leaderboard/>}/>


          </Routes>
        </main>


     
      </div>
    </AuthProvider>
    </BrowserRouter>
  )
}

export default App
