import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CsvReader from './components/csvreader'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CsvReader/>
    </>
  )
}

export default App
