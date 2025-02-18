import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import { app, server } from "./lib/socket.js";

// import path from "path";

// const app = express();
app.use(express.json({limit : '100mb'}));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}
));

dotenv.config();

const PORT = process.env.PORT || 5001
const URI = process.env.MONGODB_URI

// const __dirname = path.resolve();

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
app.use("/api/messages",messageRoutes)

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
//     app.get("*", (req, res) => {
//       res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//     });
//   }

server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});