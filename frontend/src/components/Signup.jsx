import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = () => {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        birthday: '',
        color: '',
        photo: null
    })
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleChange = (event) => {
        if (event.target.name === 'photo') {
            setFormData({ ...formData,[event.target.name]: event.target.files[0]});
        } else {
            setFormData({...formData,[event.target.name]: event.target.value});
        }
    }

    const handleSubmit = async (event) => {
        console.log("hitting handle submit");
        event.preventDefault();

        const form = new FormData();

        for (const key in formData) {
            form.append(key, formData[key]);
        }

        const response = await fetch("http://localhost:5001/new-user", {
            method: "POST",
            body: form
        });

        const data = await response.json();
        console.log(data.message);

        if (data.message === "Username already exists.") {
            setMessage(data.message);
        } else {
            navigate("/login");
        }
    }

    return (
        <div className='flex items-center justify-center'>
            <div className='flex flex-col items-center w-full max-w-2xl'>
            <h1 className='text-4xl text-bold mt-5'>Sign up as a CV Friend: </h1>
            <form onSubmit={handleSubmit} className='mt-5 grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div className='flex flex-col'>
                <label htmlFor='username' className='text-xl'>Username:</label>
                <input
                    type='text'
                    name='username'
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                />
                {message === "Username already exists." ? (
                    <h1 className='text-center text-red-500'>The username entered is already taken.</h1>
                ) : (
                    null
                )}
                </div>
                <div className='flex flex-col'>
                <label htmlFor='password' className='text-xl'>Password:</label>
                <input
                    type='text'
                    name='password'
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                />
                </div>
                <div className='flex flex-col'>
                <label htmlFor='name' className='text-xl'>Name:</label>
                <input
                    type='text'
                    name='name'
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                />
                </div>
                <div className='flex flex-col'>
                <label htmlFor='birthday' className='text-xl'>Birthday:</label>
                <input
                    type='text'
                    name='birthday'
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                />
                </div>
                <div className='flex flex-col'>
                <label htmlFor='color' className='text-xl'>Color:</label>
                <input
                    type='text'
                    name='color'
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                />
                </div>
                <div className='flex flex-col'>
                <label htmlFor='photo' className='text-xl'>Photo:</label>
                <input
                    type='file'
                    name='photo'
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                />
                {formData.photo && (
                    <img
                        src={URL.createObjectURL(formData.photo)} //temporary url to see photo
                        alt="image of friend"
                        className="mt-2"
                        style={{ width: '100px', height: '150px', objectFit: 'cover' }}
                    />
                        )}
                </div>
                <button type='submit' className='bg-blue-500 text-white py-1.5 px-2 border rounded text-xl mt-5'>Submit</button>
            </form>
            </div>
        </div>
    )
}

export default Signup

/*
    const handleSignUp = async (formData) => {
        console.log("hitting handle signup")
        const response = await fetch("http://localhost:5001/new-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        const data = await response.json()
        console.log(data)
        console.log(data.message)

        if (data.message === "Username already exists.") {
            setMessage(data.message)
        } else {
            navigate("/login")
        }
        
    }

    const handleSubmit = async (event) => {
        console.log("hitting handle submit")
        event.preventDefault()
        await handleSignUp(formData)
    }
*/