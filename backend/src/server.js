import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import userRoute from "./routes/user.route.js"
import chatRoute from "./routes/chat.route.js"
import cookieParser from "cookie-parser"
import { connectdb } from "./lib/lib.js"

import cors from "cors"

dotenv.config()

const app =express()
const PORT= process.env.PORT

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth',authRoutes)
app.use('/api/user',userRoute)
app.use('/api/chat',chatRoute)
app.listen(PORT,()=>{
    console.log("server is on the port")
    connectdb()
})