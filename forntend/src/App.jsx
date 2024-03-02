import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './component/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
 <>
  <h1>hello react</h1>
  <Login/>
 </>
 
    
  )
}

export default App
