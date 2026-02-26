import express from "express"
import cors from "cors"
import connectDB from "./config/db.js"
import dotenv from "dotenv"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.route.js"
dotenv.config();
const app=express();
connectDB();
let port = process.env.PORT || 3000;
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,    
}));
app.use(express.json());
app.use(cookieParser());
app.get("/",(req,res)=>{
    res.send("Hello World");
})
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})