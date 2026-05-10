'use client'
import Messagecard from '@/components/Messagecard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/model/user.model'
import { acceptmessageSchema } from '@/Schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/Apiresponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

function page() {
    const [messages, setmessages] = useState<Message[]>([])
    const [isloading, setisloading] = useState(false)
    const [isswitchloading, setisswitchloading] = useState(false)

    const handleDeleteMessage=(messageId:string)=>{
        setmessages(messages.filter((message)=>message._id!==messageId))
    }

    const {data:session}=useSession()
    const form=useForm({
        resolver:zodResolver(acceptmessageSchema)
    })
    const{register,watch, setValue}=form
    const acceptingmessage=watch('acceptingmessage')

    const fetchAcceptMessage=useCallback(async()=>{
        setisswitchloading(true)
        try {
            const response=await axios.get<ApiResponse>(`/api/accept-message`)
            setValue('acceptingmessage',response.data.isAcceptingMessage ?? false)
        } catch (error:any) {
            console.log(error)
            toast.error("Error",{
                description:"Failed to fetch settiings"
            })
        }finally{
            setisswitchloading(false)
        }
    },[setValue])

    const fetchMessages=useCallback(async(refresh:boolean=false)=>{
        setisloading(true)
        setisswitchloading(true)
        try {
            const response=await axios.get<ApiResponse>(`/api/getmessage`)
            setmessages(response.data.messages || [])
            if(refresh){
                toast("Refreshed Messages")
            }
        } catch (error:any) {
            console.log(error)
            toast.error("Error",{
                description:"Failed to fetch messages"
            })
        }finally{
            setisswitchloading(false)
            setisloading(false)
        }
    },[setisloading,setmessages])

    useEffect(() => {
        if(!session || !session.user) return;
        fetchMessages()
        fetchAcceptMessage()
    }, [session,setValue,fetchAcceptMessage])
    
    const handleswitchchange=async()=>{
        try {
          console.log(acceptingmessage)
            const response=await axios.post<ApiResponse>(`api/accept-message`,{
                acceptingmessage:!acceptingmessage
            })
            console.log(response)
            toast(response.data.message)
        } catch (error:any) {
            console.log(error)
            toast.error("Error in switching")
        }
    }

    if(!session || !session.user){
        return<>
            <div>Please Login</div>
        </>
    }

    const {username,_id}=session.user as User
    const baseurl=`${window.location.protocol}//${window.location.host}`
    const profileurl=`${baseurl}/u/${_id}`

    const copyToClipboard=()=>{
        navigator.clipboard.writeText(profileurl)
        toast("URL copied to clipboard")
    }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
    <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
      <div className="flex items-center">
        <input
          type="text"
          value={profileurl}
          disabled
          className="input input-bordered w-full p-2 mr-2"
        />
        <Button onClick={copyToClipboard}>Copy</Button>
      </div>
    </div>

    <div className="mb-4">
      <Switch
        {...register('acceptingmessage')}
        checked={acceptingmessage}
        onCheckedChange={handleswitchchange}
        disabled={isswitchloading}
      />
      <span className="ml-2">
        Accept Messages: {acceptingmessage ? 'On' : 'Off'}
      </span>
    </div>
    <Separator />

    <Button
      className="mt-4"
      variant="outline"
      onClick={(e) => {
        e.preventDefault();
        fetchMessages(true);
      }}
    >
      {isloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCcw className="h-4 w-4" />
      )}
    </Button>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <Messagecard
            message={message}
            onMessageDelete={handleDeleteMessage}
          />
        ))
      ) : (
        <p>No messages to display.</p>
      )}
    </div>
  </div>
);
}

export default page