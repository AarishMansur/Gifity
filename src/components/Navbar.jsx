
import { motion } from "motion/react"

function Navbar({mode,setMode}) {
 
    
  return (
     <div  className={` px-2 py-4 flex justify-between lg:px-5 ${mode=='dark'?'bg-slate-950':'bg-slate-100'} transition-all duration-500`}>
        <p className={`text-3xl ${mode=='dark'?'text-slate-200 ':'text-black '} transition-all duration-500 `}><span className='bg-red-600 px-2 py-1  rounded-2xl  text-slate-200 '>GIF</span>ITY</p>

        <div className='flex justify-between gap-5 '>

        <button className='hidden lg:flex justify-center items-center text-2xl   bg-slate-800 rounded-2xl  text-white px-1 py-2 '> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#E31B41" className="size-6">
  <motion.path 
    initial  = {{
      pathLength :0
    }}
    animate={{
      pathLength:1
    }}
    transition={ {
      duration  : 3,
         ease: "linear",
      repeatType:"reverse",
      repeat:Infinity
      
    }}
  strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
  <path 
  
  strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
</svg>
<a  target="_blank" href="https://github.com/AarishMansur/Gifity">Built by Aarish</a>
 </button>

 <button  onClick={() => setMode(prev => (prev === 'dark' ? 'light' : 'dark'))}
          className={`text-white px-2 py-2 rounded-xl border ${
            mode === 'dark' ? 'border-white bg-slate-200' : 'border-black bg-slate-950'
          }`} 
          >

{mode =='dark'?<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#000000" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
</svg>
 :
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#797979" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
</svg>
}
  

</button>
</div>
      </div>
  )
}

export default Navbar