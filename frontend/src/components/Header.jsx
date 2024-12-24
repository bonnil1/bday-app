import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom'
import { FaSearch } from "react-icons/fa";

const Header = (props) => {
    const username = localStorage.getItem("username")
    const role = localStorage.getItem("role")

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const loggedIn = (
        
        <div className='flex items-center justify-between w-full mr-10'>
            <h3 className='text-3xl ml-10'>🦋</h3>
            <div>
            <form onSubmit={props.handleSubmit} className='flex'>
                    <input
                        type='text'
                        name='name'
                        placeholder='Enter the full name of a CV friend.'
                        onChange={props.handleChange}
                        className='border border-black rounded p-1 w-64'
                    />
                    <button type='submit' className='bg-blue-500 text-white px-2 border rounded-full text-sm sm:text-lg ml-3'><FaSearch /></button>
            </form>
            </div>
            <div className='flex'>
                <div className='flex flex-col'>
                    <button onClick={toggleMobileMenu} className="text-lg sm:text-xl mr-5">
                        Welcome, {username}
                    </button>  
                    {role === "admin_role" && <h6 className='text-xs text-blue-500'>admin</h6>}
                </div>
                <div className={`relative ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
                    <div className="absolute right-0 mt-10 w-20 sm:w-24 bg-blue-500 border border-gray-300 shadow-md rounded-xl">
                        <div className="px-2 pt-2 pb-1">
                            <Link to="/login" onClick={() => { props.handleLogout(); closeMenu();}} className='text-md sm:text-xl block text-white hover:underline border-c border-gray-300 px-1 py-0.5'>
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
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
        <div className='mt-5 flex justify-end'>
            {props.isLoggedIn ? loggedIn : notLoggedIn}
        </div>
    )
}

export default Header