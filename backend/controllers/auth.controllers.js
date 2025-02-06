import User from "../models/user.models.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcrypt";

export const signup= async(req,res)=>{
    const {fullname,email,password} = req.body;
    try {
        if(!fullname || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        

        if(password.length<6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }
        
        const user = await User.findOne({email});
        if(user)
            return res.status(400).json({message:"user already exist"});

        const hashPassword = await bcrypt.hash(password,10);

        const createdUser = new User({
           fullname,
           email,
           password: hashPassword
        });

        if(createdUser){
            // genrate jwt token here
            generateToken(createdUser._id, res)
            await createdUser.save();

            res.status(201).json({message:"user created successfully",user:{
                _id: createdUser._id,
                    fullname: createdUser.fullname,
                    email: createdUser.email,
                    profilePic : createdUser.profilePic}
                });
        }
        else{
            res.status(400).json({message : "Invalid user data"});
        }

    } catch (error) {
        console.log("Error in signup controller ",error.message);
        return res.status(500).json({message:"internal server error"});
    }
};

export const login = async (req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email});
        const isMatch = await bcrypt.compare(password,user.password)
        if(!user || !isMatch){
            return res.status(400).json({message:"invalid credentials"})
        }
            generateToken(user._id,res);
             res.status(200).json({message:"Login Successfully", user:{
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                profilePic : user.profilePic
            }})
    } catch (error) {
        console.log("Error in login controller : ",error.message);
        return res.status(500).json({message:"internal server error"})
    }
};

export const logout = (req,res)=>{
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message : "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).jason({message : "Internal server error"});
    }
};

export const updateProfile = async (req,res)  => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message : "profile pic required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error in update profile : ", error);
        return res.status(500).json({message : "internal server error"})
        
    }
};

export const checkAuth = (req,res) =>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller : ", error.message);
        res.status(500).json({message : "internal server error"})
        
    }
};