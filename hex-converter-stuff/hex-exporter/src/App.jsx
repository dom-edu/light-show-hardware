import { useState } from 'react'
import HexExporter from "./HexExporter"
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
	    <HexExporter />

    </>
  )
}

export default App
