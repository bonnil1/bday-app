import React from 'react'
import { useEffect, useState } from 'react'
import data from '../assets/friends.json'

const Birthday = () => {

    const [friends, setFriends] = useState([])
    const [input, setInput] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [matchedFriend, setMatchedFriend] = useState(null)
    const [match, setMatch] = useState(null)

    useEffect(() => {
        setFriends(data.friends)
    }, [])

    const handleChange = (e) => {
        setInput(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        const posresponse = friends.find(friend => friend.name.toLowerCase() === input.toLowerCase())
        
        if (posresponse) {
            setMatchedFriend(posresponse)
            setMatch(true)
        } else {
            setMatch(false)
        }
    }

    return (
        <div className='flex items-center justify-center '>
            <div className='flex justify-center flex-col items-center w-full max-w-2xl'>
                <h1 className='text-4xl text-bold'>Welcome to CV Girls' Birthdays!</h1>
                <form onSubmit={handleSubmit} className='mt-10 flex flex-col w-full items-center'>
                    <label htmlFor='input' className='text-xl'>Enter the full name of a Castro Valley friend.</label>

                    <input
                        type='text'
                        id='input'
                        value={input}
                        onChange={handleChange}
                        className='border border-black rounded mt-5 p-1 w-1/2'
                    />
                    <button type='submit' className='bg-blue-500 text-white py-1.5 px-2 border rounded text-xl mt-5 w-1/4'>Submit</button>

                    {submitted && (
                        <div className='mt-5'>
                        {match === true ? (
                            <>
                                <h3 className={`text-lg font-${matchedFriend.font} text-${matchedFriend.color}-500`}>{matchedFriend.name}'s birthday is {matchedFriend.birthday}!</h3>
                                <img className='mt-5 w-1/2 mx-auto' src={`${matchedFriend.photo}`}></img>
                            </>
                        ) : (
                            <h3>That is not a CV friend. 😕</h3>
                        )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default Birthday