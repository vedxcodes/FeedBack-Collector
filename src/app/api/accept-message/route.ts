import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/user.model";

export async function POST(request:Request){
    await dbconnect()

    const session =await getServerSession(authOptions)
    const user=session?.user

    if(!user || !session){
        return Response.json({
            success:false,
            message:"Not authenticated"
        },{status:401})
    }

    const userid=user._id
    const {acceptingmessage} =await request.json()

   try {
     const finduser=await UserModel.findById(userid)
     if(!finduser){
         return Response.json({
             success:false,
             message:"No user found"
         },{status:401})
     }

     finduser.isAcceptingMessage=acceptingmessage
     await finduser.save()
 
     return Response.json({
         success:true,
         message:"Accepting message toggled"
     },{status:200})

   } catch (error:any) {
        console.error(error)
        return Response.json({
            success:false,
            message:"Error in accepting message"
        },{status:500})
   }
}

export async function GET(request:Request){
    await dbconnect()

    const session =await getServerSession(authOptions)
    const user=session?.user

    if(!user || !session){
        return Response.json({
            success:false,
            message:"Not authenticated"
        },{status:401})
    }

    const userid=user._id
   try {
     const finduser=await UserModel.findById(userid)

     if(!finduser){
         return Response.json({
             success:false,
             message:"Failed to found the user"
         },{status:404})
     }

     return Response.json({
         success:true,
         isAcceptingMessage:finduser.isAcceptingMessage
     },{status:200})

   } catch (error:any) {
        console.error(error)
        return Response.json({
            success:false,
            message:"Error in getting accepting message"
        },{status:500})
   }
}