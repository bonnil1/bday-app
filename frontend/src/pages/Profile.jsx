import React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { PiUserCircleFill } from "react-icons/pi";

const Profile = ({isLoggedIn}) => {

    const loggedinuser = localStorage.getItem("username")
    const token = localStorage.getItem("token");

    const [message, setMessage] = useState('')
    const [photo, setPhoto] = useState(null)
    const [userData, setUserData] = useState({
        name: '',
        birthday: '',
        color: '',
        address: '',
        boba: '',
        artist: '',
        game: '',
        photo: null,
    })

    useEffect(() => {
        // Fetch the existing user data
        const fetchUserData = async () => {
          try {
            const response = await fetch (`http://localhost:4000/user/${loggedinuser}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,   
                },
                credentials: 'include',
            });
            if (!response.ok) {
                console.log('Error fetching user data');
            }
            const data = await response.json();
            setUserData({
                name: data.name,
                birthday: data.birthday,
                color: data.color,
                address: data.address,
                boba: data.boba,
                artist: data.artist,
                game: data.game,
                photo: data.photo,
            });
          } catch (err) {
            setError('Error fetching user data');
          }
        };
    
        fetchUserData();
      }, [loggedinuser]);

    const handleChange = (event) => {
        setUserData(prevState => {
            const updatedUserData = {...prevState,[event.target.name]: event.target.value};

            return updatedUserData;
        })
    };

    const handleDateChange = (date) => {
        const cleanDate = new Date(date.setHours(0, 0, 0, 0));

        setUserData((prevState) => ({
          ...prevState,
          birthday: cleanDate.toDateString(), 
        }));
    };

    const handlePhotoChange = (event) => {
        if (event.target.name === 'photo') {
            const selectedFile = event.target.files[0];
            setPhoto(selectedFile);
            setUserData((prevState) => ({
                ...prevState,
                photo: selectedFile,
            }));
        }
    }

    useEffect(() => {
        return () => {
          if (photo) {
            URL.revokeObjectURL(photo);
          }
        };
      }, [photo]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = new FormData();

        for (const key in userData) {
            if (key !== 'photo') {
                form.append(key, userData[key]);
            }
        }
    
        if (photo) {
            form.append('photo', photo);
        }

        try {
            const response = await fetch (`http://localhost:4000/user/${loggedinuser}`,  {
                method: 'PUT',
                headers: {
                  "Authorization": `Bearer ${token}`,
                },
                body: form,
                });
                if (!response.ok) {
                    throw new Error('Error in put fetch request.');
                }
        
                const data = await response.json();
                console.log('User data updated successfully');
                console.log(data)

                if (data.message === "User updated and new user data added successfully.") {
                    setMessage(data.message);
                } 
        } catch (err) {
            console.log('Error updating user data.');
        }
    }
    
  return (
    <div>
    {isLoggedIn ? 
    <div className='flex justify-center'>
        <div>
            <h2 className='flex justify-center text-3xl mt-5'>Complete your profile</h2>
            <form onSubmit={handleSubmit} className='mt-5 grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div className='flex flex-col md:col-span-2'>
                <div className="relative mt-2">
                    <input
                        type='file'
                        name='photo'
                        onChange={handlePhotoChange}
                        className='absolute inset-0 opacity-0 cursor-pointer'
                    />
                    {photo ? (  // If a new photo is selected, show that one
                        <img
                            src={URL.createObjectURL(photo)} 
                            className='size-36 md:size-44 border-grey-600 border-2 rounded-full mx-auto'
                            alt="profile photo"
                        />
                    ) : userData.photo ? (  // If no new photo, show the pre-uploaded photo
                        <img
                            src={`http://localhost:4000/${userData.photo}`}
                            className='size-36 md:size-44 border-grey-600 border-2 rounded-full mx-auto'
                            alt="profile photo"
                        />
                    ) : (  // If no photo exists at all, show the placeholder icon
                        <div
                            className="size-36 md:size-44 border-grey-600 border-2 rounded-full mx-auto"
                        >
                            <PiUserCircleFill className='size-16 text-slate-700 rounded-full mt-3'/>
                        </div>
                    )}
                </div>
                </div>
                <div className='flex flex-col'>
                <label htmlFor='name' className='text-xl'>Name:</label>
                <input
                    type='text'
                    name='name'
                    pattern="^[A-Za-z ]+$"
                    value={userData.name}
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                    required
                />
                </div>
                <div className='flex flex-col'>
                <label htmlFor='birthday' className='text-xl'>Birthday:</label>
                <DatePicker
                    name='birthday'
                    selected={userData.birthday ? new Date(userData.birthday) : null}
                    onChange={handleDateChange}
                    dateFormat="MMMM d, yyyy"
                    maxDate={new Date()}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    className='border border-black rounded mt-2 p-1 w-full'
                    required
                />
                </div>
                <div className='flex flex-col'>
                <label htmlFor='color' className='text-xl'>Color:</label>
                <select
                    name='color'
                    value={userData.color}
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1.5'
                    required
                >
                    <option value='' disabled className='text-gray-500'>Select One</option>
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
                <label htmlFor='boba' className='text-xl'>Boba Order:</label>
                <input
                    type='text'
                    name='boba'
                    placeholder={userData.boba === null || userData.boba === '' ? 'Your go-to boba drink.' : ''}
                    value={userData.boba || ''}
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                    pattern="^[A-Za-z0-9 %]+$"
                />
                </div>
                <div className='flex flex-col md:col-span-2'>
                <label htmlFor='address' className='text-xl'>Address:</label>
                    <input
                        type='text'
                        name='address'
                        placeholder={userData.address === null || userData.address === '' ? 'Enter address of your fav boba place.' : ''}
                        value={userData.address}
                        title='Address of your fav boba place.'
                        onChange={handleChange}
                        className='border border-black rounded mt-2 p-1'
                    />
                </div>
                <div className='flex flex-col'>
                <label htmlFor='artist' className='text-xl'>Artist:</label>
                <input
                    type='text'
                    name='artist'
                    placeholder={userData.artist === 'null' || userData.artist === '' ? 'Your favorite singer.' : ''}
                    value={userData.artist || ''}
                    onChange={handleChange}
                    className='border border-black rounded mt-2 p-1'
                    pattern="^[A-Za-z0-9 ]+$"
                />
                </div>
                <div className='flex flex-col'>
                <label htmlFor='game' className='text-xl'>Game:</label>
                <input
                    type='text'
                    name='game'
                    placeholder={userData.game === 'null' || userData.game === '' ? 'Fav board / card game.' : ''}
                    value={userData.game || ''}
                    onChange={handleChange} 
                    pattern="^[A-Za-z0-9 ]+$"
                    className='border border-black rounded mt-2 p-1'
                />
                </div>
                <button type='submit' className='bg-blue-500 text-white py-1.5 px-2 border rounded text-xl mt-5'>Submit</button>
                {message === "User updated and new user data added successfully." ? (
                    <h1 className='text-xs text-blue-500'>Profile updated successfully.</h1>
                ) : (
                    null
                )}
            </form>
        </div>
    </div>
    : 
    <div>
    <h1 className='text-3xl sm:text-6xl font-bold text-center mt-10'>Welcome to CV Girls' Birthdays!</h1>
    <h3 className='text-xl text-center mt-32'>Sign up / Log in to view birthday information.</h3>
    </div>
    }
    </div>
  )
}

export default Profile