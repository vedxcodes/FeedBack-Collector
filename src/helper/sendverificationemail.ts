import {resend} from '@/lib/resend'
import VerificationEmail from '../../email/verificationemail'
import { ApiResponse } from '@/types/Apiresponse'

export async function sendverificationemail(
    email:string,
    smallusername:string,
    verifycode:string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Hello world',
            react: VerificationEmail({ username:smallusername,otp:verifycode }),
        });

        return {success:true,message:"verification email sent successfully"}
    } catch (error) {
        console.error("error in sending email",error)
        return {success:false,message:"Failed to send verification email"}
    }
}