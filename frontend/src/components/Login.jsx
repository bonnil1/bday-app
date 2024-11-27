import React from 'react'
import { useState } from 'react'

const Login = () => {

    const [formData, setFormData ] = useState({}) 

    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const submit = await handleLogin(formData)
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
                    id='username'
                    value={formData.username}
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                />
                </div>
                <div className='flex flex-col'>
                <label htmlFor='input' className='text-xl'>Password:</label>
                <input
                    type='text'
                    id='password'
                    value={formData.password}
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                />
                </div>
            </form>
            <button type='submit' className='bg-blue-500 text-white py-1.5 px-2 border rounded text-xl mt-5'>Submit</button>
            </div>
        </div>
    )
}

export default Login