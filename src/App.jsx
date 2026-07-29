import { useState } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App;