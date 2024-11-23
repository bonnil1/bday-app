import Birthday from './pages/Birthday'
import friends from './assets/friends.json'
import { useState, useEffect } from 'react'

function App() {

  const [data, setData] = useState(null)

  useEffect(() => {
    setData(friends.friends)
  }, [])
  console.log("hitting frontend")

  const sendFriends = async () => {
    console.log("hitting send friends")
    try {
      console.log("before fetch")
      const response = await fetch("http://backend:5001/send-array", {
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
      <button onClick={sendFriends} className='bg-blue-500 text-white py-1.5 px-2 border rounded text-xl mt-5 w-1/4'>Send Data to Database</button>
    </>
  )
}

export default App
