import React from 'react'

const Usernames = ({getUsers}) => {

    return (
        <div className='w-3/4 md:ml-10'>
            <button onClick={getUsers} className='text-xs sm:text-sm bg-blue-500 text-white py-1.5 px-2 border rounded mt-20'>Get all users.</button>
        </div>
    )
}

export default Usernames