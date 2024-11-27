import Birthday from './pages/Birthday'
import friends from './assets/friends.json'
import { useState, useEffect } from 'react'

function App() {

  const [data, setData] = useState(null)

  useEffect(() => {
    setData(friends.friends)
  }, [])

  const sendFriends = async () => {
    try {
      console.log("before fetch")
      const response = await fetch("http://localhost:5001/send-array", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: data })
      })
      console.log("after fetch")

      const goData = await response.json()
      console.log("Sending data to backend.")

    } catch(error) {
      console.error("Error sending data to backend.")
    }
  }

  return (
    <>
      <Birthday />
      <div className='flex items-center justify-center'>
        <button onClick={sendFriends} className='flex justify-center bg-blue-500 text-white py-1.5 px-2 border rounded text-xl mt-5 w-1/4'>Send Data to Database</button>
      </div>
    </>
  )
}

export default App
