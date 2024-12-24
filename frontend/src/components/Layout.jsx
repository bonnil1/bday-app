import React from 'react'
import Header from './Header';
import Usernames from './Usernames';
import Delete from './Delete';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {

    const loggedinuser = localStorage.getItem("username")
    const token = localStorage.getItem("token");

    // Login and Logout variables
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [currentUser, setCurrentUser] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    // Get Friend variables
    const [input, setInput] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [found, setFound] = useState(false)
    const [friend, setFriend] = useState({})
    const [friendun, setFriendun] = useState('')
    const [click, setClick] = useState(false)

    // Get all username variables
    const [usernames, setUsernames] = useState([])
    const [clicked, setClicked] = useState(false)

    // Delete use variables
    const [deleted, setDeleted] = useState(false)

    // Functions to handle log in and log out
    const handleLogIn = async (user) => {
        console.log("in handle login")
        const response = await fetch ("http://localhost:4000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",    
        },
        credentials: 'include',
        body: JSON.stringify(user)
        })
        const data = await response.json()
        //console.log(data)

        setCurrentUser(data.currentUser)
        setMessage(data.message)
        console.log(data.message)

        if (response.status != 200) {
        return data
        } else {
        console.log(data)
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.currentUser)
        localStorage.setItem("role", data.role)

        setIsLoggedIn(true)
        navigate("/")
    }  

    const handleLogout = async () => {
        {/*commented out code is for express.js backend */}
        {/* 
        const response = await fetch('http://localhost:4000/logout', {
        method: 'POST',
        credentials: 'include'  
        });

        const data = await response.json();

        if (response.ok) {
        console.log('Logout successful:', data.message);
        */}
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        localStorage.removeItem("role")
        setIsLoggedIn(false)
        setSubmitted(false)
        setDeleted(false)
        setClick(false)
        navigate("/login")
        {/*
        } else {
        console.error('Logout failed:', data.message);
        }
         */}
    }

    // Function to handle form input and get user
    const getFriend = async () => {

        const response = await fetch("http://localhost:4000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,   
            },
            credentials: 'include',
            body: JSON.stringify({ name: input })
        })
        const data = await response.json()
        console.log(data)

        if (Array.isArray(data)) {
            setFound(true);
            setFriend(data);
            setFriendun(data[2])
        } else if (data && typeof data === 'object') {
            setFound(false);
        }
    }

    const handleChange = (event) => {
        setInput(event.target.value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitted(true)
        setClick(false)
        setDeleted(false)
        await getFriend(input);
    }

    useEffect(() => {
        if (clicked === true) {
            console.log("clicked is true")
            setClick(true);
        }
    }, [clicked]);

    // Function to get all usernames 
    const getUsers = async () => {
        console.log("hitting get all usernames in frontend")
        setClicked(false)
        setDeleted(false)
        const response = await fetch("http://localhost:4000/friends", {
            headers: {
                "Authorization": `Bearer ${token}`,   
            },
            credentials: 'include',
        })
        const data = await response.json();
        console.log(data)

        if (Array.isArray(data)) {
            setUsernames(data)
            setClicked(true)
        }
    }

    // Function to delete user
    const deleteUser = async () => {
        console.log("hitting delete user in frontend")
        const response = await fetch("http://localhost:4000/byeuser", {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,  
            },
            credentials: 'include',
            body: JSON.stringify({ username: friendun, loggedinuser: loggedinuser })
        })
        const data = await response.json()
        console.log(data.message)

        if (!response.ok) {
            throw new Error('Failed to delete user');
        }
        
        if (data.message === 'User deleted.') {
            setDeleted(true)
            setSubmitted(false)
            setClick(false)
        } 
    }

    return (
        <div className='flex flex-col h-screen'>

            {/* Header */}
            <Header isLoggedIn={isLoggedIn} currentUser={currentUser} handleLogout={handleLogout} handleChange={handleChange} handleSubmit={handleSubmit}/>

            <div className='flex flex-1'>

                {/* Sidebar */}
                {isLoggedIn ? 
                <div className=''>
                    <Usernames getUsers={getUsers}/>
                    <Delete deleteUser={deleteUser} deleted={deleted} found={found} friendun={friendun}/>
                </div>
                : null
                }

                {/* Main Content */}
                <div className='w-full'>
                    {React.cloneElement(children, {handleLogIn, message, isLoggedIn, submitted, found, friend, friendun, click, usernames, clicked, deleted })}
                </div>
            </div>
        </div>
    )
}

export default Layout