import React from 'react'

const Birthday = ({ isLoggedIn, handleChange, handleSubmit, submitted, found, friend, deleted, click, usernames }) => {

    return (
        <div>
        {isLoggedIn ? 
        <div className='flex items-center justify-center'>
            <div className='flex flex-col items-center w-full max-w-2xl'>
                <h1 className='text-2xl sm:text-4xl font-bold mt-5'>Welcome to CV Girls' Birthdays!</h1>
                <div className='mt-5 flex flex-col w-full items-center'>
                    {submitted && (
                        <>
                        {found === true ? (
                            <>
                                <h3 className={`mt-5 text-md sm:text-lg`} style={{ color: `${friend[8]}` }}>{friend[6]}'s birthday is {friend[7]}!</h3>
                                <img className='mt-5 w-1/2 mx-auto' src={`http://localhost:4000/${friend[9]}`}></img>
                            </>
                        ) : (
                            <h3 className='mt-5'>That is not a CV friend. 😕</h3>
                        )}
                        </>
                    )}
                    {/*deleted button here */}
                    {deleted && (<h3 className='text-center text-red-500 mt-3'>User: {friend[2]} deleted.</h3>)}
                </div>
                {/*Get Usernames Button*/}
                {click === true ? (
                    <div className='bg-blue-300 px-6 py-6 shadow-md rounded-md border mt-5 mb-5'>
                        <h3 className='text-xl underline-offset-4 mb-2'>Registered Users:</h3>
                        {usernames.map((username, index) => (
                            <li key={index} className='list-decimal'>{username}</li>
                        ))}
                    </div>
                ) : (
                    null
                )}
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

export default Birthday
