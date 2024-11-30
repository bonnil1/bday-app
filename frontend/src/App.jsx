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

    localStorage.setItem("authToken", data.access_token)
    localStorage.setItem("username", user.username)

    setIsLoggedIn(true) //possibly can delete this line
    navigate("/")
  }  

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("username")
    setIsLoggedIn(false)
    navigate("/login")
  }

  useEffect(()=>{
    let token = localStorage.getItem("authToken")
    if(!token) {
      setIsLoggedIn(false) 
    } else {
      setIsLoggedIn(true) 
    }
  }, [])

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
