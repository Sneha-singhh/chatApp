import express from "express";
import dotenv, { configDotenv } from "dotenv"
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}
))
dotenv.config();

const PORT = process.env.PORT || 5001
const URI = process.env.MONGODB_URI

// connect to mongodb
try {
    mongoose.connect(URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("mongodb connected");
    
} catch (error) {
    console.log("Error : ", error);
    
}

// routes
app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});