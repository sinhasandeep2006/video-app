import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const signup = async (req, res) => {
  const { email, fullname, password } = req.body;
  try {
    if (!email || !password || !fullname) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = new User({
      email,
      fullname,
      password,
      profilePic: randomAvatar,
    });
    await newUser.save();
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullname,
        image: newUser.profilePic || " ",
      });
      console.log(`stream user is created ${newUser.fullname}`);
    } catch (error) {
      console.log("error at stram", error);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    const userResponse = { ...newUser.toObject(), password: undefined };

    res.status(201).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    const userResponse = { ...user.toObject(), password: undefined };

    res.status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};

export const onboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const { fullname, bio, NativeLanguage, learningLanguage, location } = req.body;

    if(!fullname ||!bio ||!NativeLanguage ||!learningLanguage||!location){
      return res.status(400).json({
        message:"all the field must filled",
        missingFields:[
          !fullname &&"fullname" , 
          !bio && "bio", 
          !NativeLanguage && "NativeLanguage", 
          !learningLanguage && "learningLanguage", 
          !location &&"location",
        ],
      })
    }
    const upadateduser=await User.findByIdAndUpdate(userId,{
      ...req.body,
      isOnboarded:true,
    },{new:true})

    if( !upadateduser){
      return res.status(404).json({ message: "user is not found" })
    }
    try {
      await upsertStreamUser({
        id:upadateduser._id.toString(),
        name:upadateduser.fullname,
        image:upadateduser.profilePic || "" ,
  
      })
      console.log(upadateduser.fullname)
    } catch (error) {
      confole.log(error)
    }
    
    res.status(200).json({ success: true, user:upadateduser});
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "onborad is failed" });
  }
};

export const me = async (req,res)=>{
  res.status(200).json({
    success:true,
    user:req.user
  })
}