'use client'
import React from 'react'

type Cardprops = {
    content:String
}

function Testimonial({content}:Cardprops) {
  return (
    <div className='flex max-w-[300px] max-h-[350px] flex-col py-3 px-5 rounded-xl border-[1px] shadow-lg'>
        <div className='flex w-full h-[35%] gap-4 items-center pb-3'>
            <div className='w-10 h-10 rounded-full bg-amber-300'></div>
            <div className='text-lg font-semibold'>Sarthak Jaiswal</div>
        </div>
        <div className='h-[65%] w-full '>
            <h1>{content}</h1>
        </div>
    </div>
  )
}

export default Testimonial