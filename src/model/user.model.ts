import mongoose,{Schema,Document} from 'mongoose'

export interface Message extends Document{
    content:string;
    createdAt:Date
}

const MessageSchema:Schema<Message>=new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifycode:string;
    verifycodeExpiry:Date;
    isAcceptingMessage:boolean;
    isverified:boolean;
    message:Message[]
}

const UserSchema:Schema<User>=new Schema({
    username:{
        type:String,
        required: [true,"Username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required: [true,"Email is required"],
        unique:true,
        match:[/.+\@.+\..+/,"please use a valid email address"]
    },
    password:{
        type:String,
        requires:[true,'password is required'],
    },
    verifycode:{
        type:String,
        requires:[true,'verify code is required'],
    },
    verifycodeExpiry:{
        type:Date,
        requires:[true,'verify code expiry is required'],
    },
    isverified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:false
    },
    message:[MessageSchema]
})

const UserModel=(mongoose.models.User as mongoose.Model<User> )||(mongoose.model<User>("User",UserSchema))
export default UserModel