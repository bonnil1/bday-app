import React from 'react'
import { Link } from 'react-router-dom'

const Header = (props) => {
    const username = localStorage.getItem("username")
    const role = localStorage.getItem("role")

    const loggedIn = (
        
        <div className='flex items-center justify-between w-full mr-10'>
            <button onClick={props.handleLogout} className='text-2xl font-bold text-blue-500 hover:text-blue-600'>logout</button>   
            <div className='flex flex-col'>
                <h1 className="text-xl">welcome, {username}</h1>  
                {role === "admin_role" && <h6 className='text-xs text-blue-500'>admin</h6>}
            </div>
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