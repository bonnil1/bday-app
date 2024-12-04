import Header from './components/Header'
import Signup from './components/Signup'
import Login from './components/Login'
import Birthday from './pages/Birthday'
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleLogIn = async (user) => {
    console.log("in handle login")
    const response = await fetch ("http://localhost:5001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"    
      },
      credentials: 'include',
      body: JSON.stringify(user)
    })
    const data = await response.json()
    setCurrentUser(data.currentUser)

    setMessage(data.message)
    console.log(data.message)

    if (response.status != 200) {
      return data
    } else {
      console.log(data)
    }

    localStorage.setItem("username", data.currentUser)
    localStorage.setItem("role", data.role)

    setIsLoggedIn(true)
    navigate("/")
  }  

  const handleLogout = async () => {
    const response = await fetch('http://localhost:5001/logout', {
      method: 'POST',
      credentials: 'include'  
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Logout successful:', data.message);

      localStorage.removeItem("username")
      localStorage.removeItem("role")
      setIsLoggedIn(false)
      navigate("/login")
    } else {
      console.error('Logout failed:', data.message);
    }
  }

  return (
      <div>
        <Header isLoggedIn={isLoggedIn} currentUser={currentUser} handleLogout={handleLogout}/>
        <Routes>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/login" element={<Login handleLogIn={handleLogIn} message={message}/>}/>
          <Route path="/" element={<Birthday isLoggedIn={isLoggedIn} />}/>
        </Routes>
      </div>
  )
}

export default App
