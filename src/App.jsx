import { useState } from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import { AuthProvider } from './shared/context/AuthContext.jsx'
import ProtectedRoute from './shared/components/ProtectedRoute.jsx'
import Navbar from './shared/components/Navbar.jsx'

import './App.css'


function App() {

  return (

    <BrowserRouter>
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <Navbar/>


     
      </div>
    </AuthProvider>
    </BrowserRouter>
  )
}

export default App
