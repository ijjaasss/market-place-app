import express from "express";
import { connectDB } from "./config/db.js";
import env from "./config/env.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import morgan from "morgan";
import routes from './routes/index.js';

const app=express();
connectDB()
const options={
    origin: [
    env.CLIENT_URL,
    env.ADMIN_URL
  ], 
  credentials: true              
}
app.use(cookieParser());
app.use(cors(options));

app.use(express.json())
app.use(express.urlencoded({extended:true}))

if(env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

app.use('/api',routes)

app.use((err, req, res, next) => {
  console.error(err.stack);
   const statusCode = err.statusCode || 500;
 res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;