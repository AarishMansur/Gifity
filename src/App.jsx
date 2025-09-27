
import { useState } from 'react'
import VideoShow from './components/VideoShow'
import Home from './components/Home'
import {  BrowserRouter as Router, Routes, Route  } from 'react-router-dom'


function App() {

  

 const [theme,setTheme] = useState('dark')
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element = {<Home mode = {theme} setMode = {setTheme} />} />
        
        <Route path='/Gif-Creation' element ={<VideoShow mode={theme} setmode={setTheme} />} />
</Routes>
</Router>
</>
  )
}

export default App