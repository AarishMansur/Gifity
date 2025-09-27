import React from 'react'

function Hero({mode}) {
  return (
     <div className='flex justify-center flex-col items-center gap-10   '>

 <h3 className={` text-5xl lg:text-8xl flex justify-center mx-auto items-center flex-col  mt-25 ${mode=='dark'?'text-white':'text-slate-950'} transition-full duration-500 gap-4  `}>Make GIFs with <br /> <span className='text-red-500 text-7xl lg:text-9xl font-bold '>Videos</span> </h3>

<h3 className={`${mode=='dark'?'text-slate-300':'text-slate-800'} text-2xl transition-all duration-500 `}>And send to  your Friends </h3>

 </div>
  )
}

export default Hero
