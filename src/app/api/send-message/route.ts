import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";

export async function POST(request:Request){
    await dbconnect() 

    const reqbody=await request.json()
    const {username,content}=reqbody
    console.log(username)
    try {
        const finduser=await UserModel.findById(username)

        if(!finduser){
            return Response.json({
                success:false,
                message:"no user found"
            },{status:404})
        } 

        if(!finduser.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"user not accepting message"
            },{status:401})
        }

        const newMessage={content,createdAt:new Date()}
        finduser.message.push(newMessage as Message)
        await finduser.save()

        return Response.json({
            success:true,
            message:"message end successfully"
        },{status:200})
        
    } catch (error:any) {
        console.error(error)
        return Response.json({
            success:false,
            message:"unexpected error occured in sending message"
        },{status:500})
    }
}