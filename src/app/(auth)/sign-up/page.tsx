'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/Schemas/signupSchema"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/Apiresponse"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react';

const page = () => {
  const [username, setusername] = useState("")
  const [usernameavailable, setusernameavailable] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [loader, setloader] = useState(false)
  const [issubmitting, setissubmitting] = useState(false)
  const debounced = useDebounceCallback(setusername, 500)

  const router =useRouter()

  const form=useForm({
    resolver:zodResolver(signupSchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    }
  })

  useEffect(() => {
    const checkusernameunique= async ()=>{
      if(username){
        setIsCheckingUsername(true)
        setusernameavailable('')
        try {
          const response=await axios.get(`/api/check-username-unique?username=${username}`)
          setusernameavailable(response.data.message)
        } catch (error:any) {
          console.log(error)
          const axioserror=error as AxiosError<ApiResponse>
          setusernameavailable(axioserror.response?.data.message ?? "Error checking username")
        }finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkusernameunique()
  }, [username])
  
  const onsubmit=async(data:z.infer<typeof signupSchema>)=>{
    setissubmitting(true)
    setloader(true)
    try {
      const response=await axios.post(`/api/signup`,data)
      toast("Event has been created.",{
        description:response.data.message
      })

      router.replace(`/verify/${username}`)
      setissubmitting(false)
    } catch (error:any) {
      console.log("Error in sign-up of user",error)
      const axioserror=error as AxiosError<ApiResponse>
      let errormessage=axioserror.response?.data.message
      toast.error("Error in sign-up",{
        description:errormessage
      })
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      const lowercasedValue = e.target.value.toLowerCase();
                      field.onChange(lowercasedValue);
                      debounced(lowercasedValue);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameavailable && (
                    <p
                      className={`text-sm ${
                        usernameavailable === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameavailable}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className='text-slate-600 text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={issubmitting}>
              {issubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page