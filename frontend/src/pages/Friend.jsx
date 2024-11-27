import React from 'react'
import { useState } from 'react'

const Friend = () => {

    const [formData, setFormData] = useState({})

    const handleSubmit = (event) => {

    }

    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    return (
        <div className='flex items-center justify-center'>
            <div className='flex flex-col items-center w-full max-w-2xl'>
            <h1 className='text-4xl text-bold mt-5'>Sign up as a CV Friend: </h1>
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
                <div className='flex flex-col'>
                <label htmlFor='input' className='text-xl'>Name:</label>
                <input
                    type='text'
                    id='name'
                    value={formData.name}
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                />
                </div>
                <div className='flex flex-col'>
                <label htmlFor='input' className='text-xl'>Birthday:</label>
                <input
                    type='text'
                    id='birthday'
                    value={formData.birthday}
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                />
                </div>
                <div className='flex flex-col'>
                <label htmlFor='input' className='text-xl'>Color:</label>
                <input
                    type='text'
                    id='color'
                    value={formData.color}
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                />
                </div>
                <div className='flex flex-col'>
                <label htmlFor='input' className='text-xl'>Photo:</label>
                <input
                    type='text'
                    id='photo'
                    value={formData.photo}
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

export default Friend