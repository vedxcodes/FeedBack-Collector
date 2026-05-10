import UserModel from "@/model/user.model";
import {z} from 'zod'
import dbconnect from "@/lib/dbconnect";
import { usernameValidation } from "@/Schemas/signupSchema";

const usernamequeryschema=z.object({
    username:usernameValidation
})

export async function GET(request:Request){
    await dbconnect()

    try {
        const searchParams = new URL(request.url).searchParams
        const queryparams={
            username:searchParams.get('username')
        }

        const result=usernamequeryschema.safeParse(queryparams)
        if(!result.success){
            const usernameerror=result.error.format().username?._errors ||[]
            return Response.json({
                success:false,
                message:usernameerror
            },{status:400})
        }

        const {username}=result.data

        const existinguser=await UserModel.findOne({username,isverified:true})
        if(existinguser){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },{status:400})
        }

        return Response.json({
            success:true,
            message:"Username is unique"
        },{status:200})

    } catch (error:any) {
        console.log("error checking username",error)
        return Response.json({
            success:false,
            message:"Error checking username"
        },{status:500})
    }
}