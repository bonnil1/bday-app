import React from 'react'
import { useEffect, useState } from 'react'
import data from '../assets/friends.json'

const Birthday = (props) => {

    const [friend, setFriend] = useState({})
    const [input, setInput] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [match, setMatch] = useState(false)

    const getFriend = async () => {
        console.log("hitting get friend")

        const response = await fetch("http://localhost:5001/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: input })
        })
        const data = await response.json()
        console.log(data)

        if (Array.isArray(data)) {
            setMatch(true);
            setFriend(data);
        } else if (data && typeof data === 'object') {
            setMatch(false);
        }
    }

    const handleChange = (event) => {
        setInput(event.target.value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitted(true)
        await getFriend(input);
    }

    return (
        <div>
        {props.isLoggedIn ? 
        <div className='flex items-center justify-center'>
            <div className='flex flex-col items-center w-full max-w-2xl'>
                <h1 className='text-4xl text-bold mt-5'>Welcome to CV Girls' Birthdays!</h1>
                <form onSubmit={handleSubmit} className='mt-5 flex flex-col w-full items-center'>
                    <label htmlFor='name' className='text-xl'>Enter the full name of a Castro Valley friend.</label>

                    <input
                        type='text'
                        name='name'
                        onChange={handleChange}
                        className='border border-black rounded mt-5 p-1 w-1/2'
                    />
                    <button type='submit' className='bg-blue-500 text-white py-1.5 px-2 border rounded text-xl mt-5 w-1/4'>Submit</button>

                    {submitted && (
                        <>
                        {match === true ? (
                            <>
                                <h3 className={`mt-5 text-lg text-${friend[0].color}-500`}>{friend[0].name}'s birthday is {friend[0].birthday}!</h3>
                                <img className='mt-5 w-1/2 mx-auto' src={`http://localhost:5001/${friend[0].photo}`}></img>
                            </>
                        ) : (
                            <h3>That is not a CV friend. 😕</h3>
                        )}
                        </>
                    )}
                </form>
            </div>
        </div>
        : 
        <div>
          <h1 className='text-6xl font-bold text-center mt-10'>Welcome to CV Girls' Birthdays!</h1>
          <h3 className='text-xl text-center mt-32'>Sign up / Log in to view birthday information.</h3>
        </div>
        }
        </div>
    )
}

export default Birthday