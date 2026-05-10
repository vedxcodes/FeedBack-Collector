'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import {X} from 'lucide-react'
import { Message } from '@/model/user.model'
import { toast } from "sonner"
import axios from 'axios'
import { ApiResponse } from '@/types/Apiresponse'

type Messagecardprop={
    message:Message;
    onMessageDelete:(messageId:string)=> void
}

function Messagecard({message,onMessageDelete}:Messagecardprop) {

    const handledeleteconfirm=async()=>{
        const resonse=await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast(resonse.data.message);
        onMessageDelete(message._id as string)
    }

  return (
    <Card className="card-bordered">
    <CardHeader>
      <div className="flex justify-between items-center gap-3">
        <CardTitle>{message.content}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive'>
              <X className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete
                this message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handledeleteconfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="text-sm">
        {/* {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')} */}
      </div>
    </CardHeader>
    <CardContent></CardContent>
  </Card>
  )
}

export default Messagecard