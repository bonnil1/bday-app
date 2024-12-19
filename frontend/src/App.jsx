import Layout from './components/Layout';
import Signup from './pages/Signup'
import Login from './pages/Login'
import Birthday from './pages/Birthday'
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
      <div>
        <Routes>
          <Route path="/signup" element={<Layout><Signup /></Layout>}/>
          <Route path="/login" element={<Layout><Login /></Layout>}/>
          <Route path="/" element={<Layout><Birthday /></Layout>}/>
        </Routes>
      </div>
  )
}

export default App
