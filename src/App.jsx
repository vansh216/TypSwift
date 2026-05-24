import { useState } from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import { AuthProvider } from './shared/context/AuthContext.jsx'
import ProtectedRoute from './shared/components/ProtectedRoute.jsx'
import Navbar from './shared/components/Navbar.jsx'
import Footer from './shared/components/Footer.jsx'

//Auth
import Login    from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';

//Leaderboard
import Leaderboard from './features/Leaderboard/pages/Leaderboard.jsx'
// Result
import Results from './features/result/pages/Results.jsx'
// profile
import Profile from './features/profile/pages/Profile.jsx'

import './App.css'
import Home from './features/Home/page/Home.jsx'
import Test from './features/test/pages/Test.jsx'


function App() {

  return (

    <BrowserRouter>
    <AuthProvider>
      <div className="min-h-screen">
        <Navbar/>

        <main>
          <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/leaderboard' element={<Leaderboard/>}/>
                <Route path='/test' element={<Test/>}/>

                 <Route path="/results" element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
                 }/>

                  <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
                
                 }/>


          </Routes>
        </main>
        {/* <Footer/> */}


     
      </div>
    </AuthProvider>
    </BrowserRouter>
  )
}

export default App
