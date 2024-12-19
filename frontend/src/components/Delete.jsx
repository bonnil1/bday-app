import React from 'react'

const Delete = ({deleteUser, found, friendun}) => {

  const loggedinuser = localStorage.getItem("username")
  const role = localStorage.getItem("role")

  console.log(friendun)
    
  return (
    <div className='w-3/4 md:ml-10'>
      {found && (
        (loggedinuser === friendun || role === 'admin_role') && (
          <button onClick={deleteUser} className='text-xs sm:text-sm bg-red-500 text-white py-1.5 px-3 border rounded mt-10'>Delete user.</button>
        )
        )}
    </div>
  )
}

export default Delete
