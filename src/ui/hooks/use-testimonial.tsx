'use client'

import { useEffect, useState } from "react"
import Testimonial from "../components/Testimonial"
import axios from "axios"

type Testimonialprops=React.HTMLAttributes<HTMLDivElement> & {
    limit:number
}

const TestimonialComponent=({limit,...props}:Testimonialprops)=>{
    const [message, setmessage] = useState([])

    useEffect(() => {
        const getmsg=async()=>{
            const response=await axios.get(`/api/getmessage`)
            setmessage(response.data.messages || [])
        }
        getmsg()
    }, [])
    console.log(message)
    
    return (
        <>
            <div className=" w-full px-8 py-3 flex flex-wrap gap-4 justify-center items-center">
                {message.map((e: { content: string }) => (
                    <Testimonial key={e.content} content={e.content} {...props}/>
                )).slice(0, limit)}
            </div>
        </>
    )
}

export default TestimonialComponent