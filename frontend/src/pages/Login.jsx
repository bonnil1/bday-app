import React from 'react'
import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';

const Login = (props) => {

    const [formData, setFormData ] = useState({}) 
    const [viewpw, setViewpw] = useState(false)

    const togglePassword = () => {
        setViewpw(prevState => !prevState)
    }

    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    const handleSubmit = async (event) => {
        console.log("in handle submit")
        event.preventDefault()
        await props.handleLogIn(formData)
    }

    return (
        <div className='flex items-center justify-center'>
            <div className='flex flex-col items-center w-full max-w-2xl'>
            <h1 className='text-4xl text-bold mt-5'>Log In: </h1>
            <form onSubmit={handleSubmit} className='mt-5 grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div className='flex flex-col'>
                <label htmlFor='input' className='text-xl'>Username:</label>
                <input
                    type='text'
                    name='username'
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                />
                </div>
                <div className='flex flex-col'>
                <label htmlFor='input' className='text-xl'>Password:</label>
                <input
                    type={viewpw ? 'text' : 'password'}
                    name='password'
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                />
                <button type="button" onClick={togglePassword} className='absolute ml-40 mt-11'>
                    {viewpw ? (<EyeOffIcon className="h-5 w-5" />) : (<EyeIcon className="h-5 w-5" />)}
                </button>
                </div>
                <button type='submit' className='bg-blue-500 text-white py-1.5 px-2 border rounded text-xl mt-5'>Submit</button>
            </form>
            {props.message === 'Invalid credentials.' ? (
                    <h1 className='text-center text-red-500 mt-3'>The username or password provided is incorrect.</h1>
                ) : props.message === 'Username not found.' ? (
                    <h1 className='text-center text-red-500 mt-3'>There is no account associated with the username.</h1>
                ) : (
                    null
                )
            }
            </div>
        </div>
    )
}

export default Login