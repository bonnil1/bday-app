import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

const Signup = () => {

    const [formData, setFormData] = useState({
        role: '',
        username: '',
        password: '',
        email: '',
        password2: '',
        name: '',
        birthday: '',
        color: '',
        photo: null
    })
    //const [role, setRole] = useState('')
    const [viewpw, setViewpw] = useState(false)
    const [viewpw2, setViewpw2] = useState(false)
    const [pwmatch, setPwmatch] = useState(null)
    const [pwchange, setPwchange] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleChange = (event) => {
        if (event.target.name === 'photo') {
            setFormData({ ...formData,[event.target.name]: event.target.files[0]});
        } else {
            setFormData(prevState => {
                const updatedFormData = {...prevState,[event.target.name]: event.target.value};

                if (event.target.name === 'email') {
                    updatedFormData.role = (event.target.value === 'bonnieliu759@gmail.com' || event.target.value === 'kimsarahe@gmail.com') ? 'admin_role' : 'user_role';
                }
                return updatedFormData;
            })
            if (event.target.name === 'password2') {
                setPwchange(true)
            }
        }
        console.log(formData)
    }

    const handleDateChange = (date) => {
        const cleanDate = new Date(date.setHours(0, 0, 0, 0));

        setFormData((prevState) => ({
          ...prevState,
          birthday: cleanDate.toDateString(), 
        }));
    };

    const togglePassword = () => {
        setViewpw(prevState => !prevState)
    }

    const togglePassword2 = () => {
        setViewpw2(prevState => !prevState)
    }

    useEffect(() => {
        if (pwchange) {
            const checkPassword = () => {
                if (formData.password === formData.password2) {
                    setPwmatch(true)
                } else {
                    setPwmatch(false)
                }
            }
            checkPassword()
        }
    }, [formData.password, formData.password2, pwchange])

    const handleSubmit = async (event) => {
        console.log("hitting handle submit");
        event.preventDefault();

        const form = new FormData();

        for (const key in formData) {
            form.append(key, formData[key]);
        }

        //console.log(form)
        console.log(form.get('photo'));

        const response = await fetch("http://localhost:4000/new-user", {
            method: "POST",
            body: form
        });

        const data = await response.json();
        console.log(data.message);

        if (data.message === "Username already exists." || data.message === "Email already exists.") {
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
                    placeholder='Enter username.'
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                    required
                    pattern="^[A-Za-z0-9]+$"
                />
                {message === "Username already exists." ? (
                    <h1 className='text-xs text-red-500'>The username entered is already taken.</h1>
                ) : (
                    null
                )}
                </div>
                <div className='flex flex-col'>
                <label htmlFor='password' className='text-xl'>Password:</label>
                <input
                    type={viewpw ? 'text' : 'password'}
                    name='password'
                    pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*[;:",`]).{8,}'
                    title='The password must contain an upper and lower case letter, a number, and be 8 characters long.'
                    placeholder='Enter password.'
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                    required
                />
                <button type="button" onClick={togglePassword} className='absolute ml-72 mt-11'>
                    {viewpw ? (<EyeOffIcon className="h-5 w-5" />) : (<EyeIcon className="h-5 w-5" />)}
                </button>
                </div>
                <div className='flex flex-col'>
                <label htmlFor='password' className='text-xl'>Email:</label>
                <input
                
                    type='email'
                    name='email'
                    placeholder='Example@email.com'
                    title='Example@email.com'
                    onChange={handleChange} 
                    pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}$" 
                    className='border border-black rounded mt-2 p-1'
                    required 
                />
                {message === "Email already exists." ? (
                    <h1 className='text-xs text-red-500'>An account with this email already exists. Please log in.</h1>
                ) : (
                    null
                )}
                </div>
                <div className='flex flex-col'>
                <label htmlFor='password2' className='text-xl'>Retype Password:</label>
                <input
                    type={viewpw2 ? 'text' : 'password'}
                    name='password2'
                    placeholder='Confirm password.'
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                    required
                />
                <button type="button" onClick={togglePassword2} className='absolute ml-72 mt-11'>
                    {viewpw2 ? (<EyeOffIcon className="h-5 w-5" />) : (<EyeIcon className="h-5 w-5" />)}
                </button>
                {pwmatch === true ? (
                    <h1 className='text-xs text-blue-500'>Passwords match.</h1>
                ) : pwmatch === false ? (
                    <h1 className='text-xs text-red-500'>Passwords do not match.</h1>
                ) : (
                    null
                )}
                </div>
                <div className='flex flex-col'>
                <label htmlFor='name' className='text-xl'>Name:</label>
                <input
                    type='text'
                    name='name'
                    pattern="^[A-Za-z ]+$"
                    placeholder='Enter full name.'
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                    required
                />
                </div>
                <div className='flex flex-col'>
                <label htmlFor='birthday' className='text-xl'>Birthday:</label>
                <DatePicker
                    name='birthday'
                    selected={formData.birthday}
                    onChange={handleDateChange}
                    dateFormat="MMMM d, yyyy"
                    maxDate={new Date()}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    placeholderText="Date of birth."
                    className='border border-black rounded mt-2 p-1 w-full'
                    required
                />
                </div>
                <div className='flex flex-col'>
                <label htmlFor='color' className='text-xl'>Color:</label>
                <select
                    type='text'
                    name='color'
                    placeholder='Select color from dropdown.'
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1.5'
                    required
                >
                    <option value='' disabled selected className='text-gray-500'>Select One</option>
                    <option value='Red'>Red 🔴</option>
                    <option value='Salmon'>Pink 🩷</option>
                    <option value='Orange'>Orange 🟠</option>
                    <option value='Gold'>Yellow 🟡</option>
                    <option value='Green'>Green 🟢</option>
                    <option value='Blue'>Blue 🔵</option>
                    <option value='Purple'>Purple 🟣</option>
                </select>
                </div>
                <div className='flex flex-col'>
                <label htmlFor='photo' className='text-xl'>Photo:</label>
                <input
                    type='file'
                    name='photo'
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                    required
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

{/*
<input
    type='text'
    name='birthday'
    placeholder='January 1, 2024'
    onChange={handleChange}
    className='border border-black rounded mt-2 p-1'
    required
    pattern="^[A-Za-z0-9 ,]+$"
/>    
*/}

{/* 
    type='email'
    name='email'
    pattern='^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i'
    placeholder='Example@email.com'
    onChange={handleChange}
    className='border border-black rounded mt-2 p-1'
    required
*/}