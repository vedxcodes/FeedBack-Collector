import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { sendverificationemail } from "@/helper/sendverificationemail";

export async function POST(request:Request){
    await dbconnect()

    try {
        const{username,email,password}=await request.json()

        const userexist=await UserModel.findOne({username})
        if(userexist?.isverified===true){
            return Response.json({
                success:false,
                message:"username already taken"
            },{status:400})
        }

        const userexistbyemail=await UserModel.findOne({email})
        const verifycode=Math.floor(100000 +Math.random()*900000).toString()

        if(userexistbyemail){
            if(userexistbyemail?.isverified===true){
                return Response.json({
                    success:false,
                    message:"user already exist with this email"
                },{status:400})
            }else{
                const hashedpassword=await bcrypt.hash(password,10);
                userexistbyemail.password=hashedpassword;
                userexistbyemail.verifycode=verifycode
                userexistbyemail.verifycodeExpiry=new Date(Date.now()+360000)
                await userexistbyemail.save()
            }
        }else{
            const bcryptpass=await bcrypt.hash(password,10)
            const expiryDate=new Date()
            expiryDate.setHours(expiryDate.getHours()+2)

            const createuser=await UserModel.create({
                username,
                email,
                password:bcryptpass,
                verifycode,
                verifycodeExpiry:expiryDate,
                isverified:false,
                messages:[]
            })
        }
        const emailresponse=await sendverificationemail(email,username,verifycode)

        if(!emailresponse.success){
            return Response.json({
                success:false,
                message:emailresponse.message
            },{status:500})
        }

        return Response.json({
            success:true,
            message:"user registered successfully and opt send successfully"
        },{status:200})

    } catch (error) {
        console.error("Error regesting user",error)
        return Response.json({
            success:false,
            message:"error registering user"
        },{status:500})
    }
}