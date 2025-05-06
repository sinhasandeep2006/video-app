import mongoose from "mongoose"
export const connectdb = async()=>{
    try {
        const conn= await mongoose.connect(process.env.MONGO_URL)
        console.log(`mongodbb is connected at ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
