import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Hero from './Hero'
function Home({mode,setMode}) {
 const navigate = useNavigate();
   
  return (
    <div className={`${mode=='dark'?'bg-slate-950' : 'bg-slate-100'} min-h-screen transition-all duration-500`}>
      <Navbar mode={mode} setMode= {setMode} />   

<Hero mode = {mode} />

        

 <button onClick={()=>{
  navigate('/GIF-Creation')
 }}   className={`flex justify-center mx-auto text-2xl ${mode =='dark'?'text-slate-900 bg-slate-300':'text-slate-300 bg-slate-900'} px-2 py-1 font-medium lg:text-3xl mt-[2rem]  rounded-xl transition-all duration-500`}>
 Build custom GIF
 
 </button>


    </div>
  )
}

export default Home