'use client'
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import Testimonial from '@/ui/components/Testimonial';
import TestimonialComponent from '@/ui/hooks/use-testimonial';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

function u_page() {

  const [review, setReview] = React.useState('');
  const [AIReview, setAIReview] = useState([])
  const [submitting, setsubmitting] = useState(false)
  const username=useParams()

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };

  const SelectReview=(e:String)=>{
    const res: string | undefined = AIReview.find((j)=> j==e)
    setReview(res || '')
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setsubmitting(true)
   try {
    const response=await axios.post(`/api/send-message`,{
      content:review,
      username:username.username
    })
    toast("Review send successfully")
    setReview('');
   } catch (error:any) {
    // console.log(error.response.data.message)
    toast.warning(error.response.data.message)
   } finally{
    setsubmitting(false)
   }
  };

  const RefreshMessage=async()=>{
    const getMessage=await axios.post('/api/suggest-message')
    setAIReview(getMessage.data.response)
  }

  useEffect(()=>{
    const getmessage=async()=>{
      const getMessage=await axios.post('/api/suggest-message')
      setAIReview(getMessage.data.response)
    }
    getmessage()
  },[])

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Review</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={review}
            onChange={handleReviewChange}
            placeholder="Write your review here..."
            className="textarea textarea-bordered w-full p-2 border-[1px] rounded-xl"
            rows={3}
          />
        </div>
        <Button 
         className={`btn btn-primary hover:cursor-pointer ${!submitting ? 'active' : 'disabled'}`}
         disabled={submitting}>
          Submit Review
        </Button>
      </form>
      <div className="mt-6 flex justify-center items-center gap-3 flex-col">
        {AIReview.map((e, index) => (
          <div onClick={()=>SelectReview(e)} key={index} className='flex gap-16 text-center flex-col py-2 px-3 border-2 shadow-md hover:shadow-xl rounded-3xl hover:cursor-pointer'>
            <p className="text-gray-700 text-md text-center">{e}</p>
          </div>
        ))}
        <Button 
          onClick={() => RefreshMessage()} 
          variant="secondary" 
          className="mt-4 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white shadow-lg hover:cursor-pointer"
        >
          Refresh Reviews
        </Button>
      </div>
      {/* <TestimonialComponent limit={5} /> */}
    </div>
  );

}

export default u_page