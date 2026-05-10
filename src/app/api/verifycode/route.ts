import UserModel from "@/model/user.model";
import dbconnect from "@/lib/dbconnect";

export async function POST(request:Request){
    await dbconnect()
    try {
        const {username,code}=await request.json()
        const decodedusername= username?.username?.[0]
        console.log(decodedusername,code)
       const user=await UserModel.findOne({username:decodedusername})
        console.log(user)
       if (!user) {
           return Response.json({
               success: false,
               message: "User not found"
           }, { status: 404 });
       }

       const iscodevalid = user.verifycode === code;
       const iscodeexpiry = new Date(user.verifycodeExpiry) > new Date();

    if (iscodevalid && iscodeexpiry) {
         user.isverified = true;
         await user.save();

         return Response.json({
          success: true,
          message: "User verified successfully",
          user:user
         }, { status: 200 });
    } else if (!iscodevalid) {
         return Response.json({
          success: false,
          message: "Invalid verification code"
         }, { status: 400 });
    } else if (!iscodeexpiry) {
         return Response.json({
          success: false,
          message: "Verification code expired"
         }, { status: 400 });
    }
    } catch (error:any) {
        console.log("error verifying user",error)
        return Response.json({
            success:false,
            message:"Error verifying user"
        },{status:500})
    }
}