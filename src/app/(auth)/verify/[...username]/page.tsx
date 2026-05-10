'use client'
import React from 'react'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { verifySchema } from '@/Schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ApiResponse } from '@/types/Apiresponse'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import {
    Form,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function page() {
    const router=useRouter()
    const params=useParams<{username:string}>()

    const form=useForm({
        resolver:zodResolver(verifySchema),
        defaultValues:{
          code:""
        }
    })

    const onSubmit=async(data:z.infer<typeof verifySchema>)=>{
      console.log(data.code,params)
        try {
            const response=await axios.post(`/api/verifycode`,{
                username:params,
                code:data.code
            })
            console.log(response.data)
            toast.success("Code verified successfully")
            router.replace('/dashboard')
        } catch (error:any) {
            console.log(error)
            const axioserror=error as AxiosError<ApiResponse>
            toast.error("Error in verifying OTP")
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Verify Your Account
        </h1>
        <p className="mb-4">Enter the verification code sent to your email</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex justify-center items-center flex-col">
          <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-center'>Verification Code</FormLabel>
                <InputOTP
                    maxLength={6}
                    {...field}
                    className='flex justify-center'
                >
                    <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSeparator />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                {/* <FormDescription>
                Please enter the one-time password sent to your email.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='flex justify-end items-end'>Verify</Button>
        </form>
      </Form>
    </div>
  </div>
  )
}

export default page