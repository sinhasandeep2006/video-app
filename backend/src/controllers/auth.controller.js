import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const signup = async (req, res) => {
  const { email, fullname, password } = req.body;
  try {
    if (!email || !password || !fullname) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (password.lenght < 8) {
      return res.status(400).json({
        message:
          "password must be of more then 7 words Please reenter the password",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "user preasnt already" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = new User({
        email,
        fullname,
        password,
        profilePic: randomAvatar,
      });

    // todo create a the user in stram as well
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      maxage: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite:"strict",
      secure:process.env.NODE_ENV==="production"
    });
    res.status(201).json({
        success:true,
        user:newUser
    })
  } catch (error) {
    console.log("error is", error)
    res.status(500).json({
        success:false,
        message:error.message
    })
  }
};
export const login = async (req, res) => {};
export const logout = async (req, res) => {};
