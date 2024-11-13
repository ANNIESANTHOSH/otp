import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import OTPForm from './component/Otp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="App">
      <OTPForm />
      </div>
    </>
  )
}

export default App
