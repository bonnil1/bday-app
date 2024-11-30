import React from 'react'
import { Link } from 'react-router-dom'

const Header = (props) => {
    const username = localStorage.getItem("username")

    const loggedIn = (
        
        <div className='flex items-center justify-between w-full mr-10'>
            <button onClick={props.handleLogout} className='text-2xl font-bold text-blue-500 hover:text-blue-600'>logout</button>   
            <h1 className="text-xl">welcome, {username}</h1>  
        </div>
    )

    const notLoggedIn = (
        <div>
          <Link to="/signup"  className='text-2xl font-bold text-blue-500 hover:text-blue-600 mr-10'>signup</Link>
          <Link to="/login" className='text-2xl font-bold text-blue-500 hover:text-blue-600 mr-10'>login </Link>
        </div>
      )

    return (
        <div className='ml-10 mt-5 flex justify-between items-center'>
            {props.isLoggedIn ? loggedIn : notLoggedIn}
        </div>
    )
}

export default Header