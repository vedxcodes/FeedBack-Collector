import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";

export async function GET(request:Request){
    await dbconnect()

    const session=await getServerSession(authOptions)
    const _user=session?.user

    if(!_user || !session){
        return Response.json({
            success:false,
            message:"Not authenticated"
        },{status:401})
    }

    const userid=new mongoose.Types.ObjectId(_user._id)
    try {
        const User=await UserModel.aggregate([
            { $match: { _id: userid } },
            { $unwind: '$message' },
            { $sort: { 'message.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$message' } } },
          ]).exec();
          console.log(User)
        if(!User || User.length === 0){
            return Response.json({
                success:false,
                message:"Failed to found the user"
            },{status:404})
        }

        return Response.json({
            messages:User[0].messages
        },{status:200})

    } catch (error:any) {
        console.error(error)
        return Response.json({
            success:false,
            message:"Error in getting messages"
        },{status:500})
   }
}