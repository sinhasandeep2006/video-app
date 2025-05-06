import mongoose, { Mongoose } from "mongoose";
import bcrypt from "bcryptjs"
const userschema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
    bio:{
        type:String,
        default:""
    },
    profilePic:{
        type:String,
        default:""
    },
    NativeLanguage:{
        type:String,
        default:""
    },
    learningLanguage:{
        type:String,
        default:""
    },
    location:{
        type:String,
        default:""
    },
    isOnboarded:{
        type:Boolean,
        default: false
    },
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
         },
    ]
},{
timestamps:true
})

const User = mongoose.model("User",userschema)

//pre hooks

userschema.pre("save",async function (next) {
    if(!this.isModified("password"))return next()
    try {
        const salt =await bcrypt.genSalt(10);
        this.password= await bcrypt.hash(this.password,salt);
        next()
    } catch (error) {
        next(error)
    }
})

export default User