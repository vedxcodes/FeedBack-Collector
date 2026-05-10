import mongoose from "mongoose";

type connectionObject={
    isconnected?:number
}

const connection :connectionObject={}

async function dbconnect():Promise<void>{
    if(connection.isconnected){
        console.log("already connected to database")
        return
    }

    try {
        const db=await mongoose.connect(process.env.MONGO_URL || "")
        connection.isconnected=db.connections[0].readyState
        console.log("DB connected successfully")

    } catch (error) {
        console.log("databse connection failed",error)
        process.exit(1)
    }
}

export default dbconnect