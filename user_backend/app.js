import express from "express";
import routes from './routes/index.js';
import morgan from 'morgan';
import env from "./config/env.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDb } from "./config/db.js";


const app = express();
connectDb()

const options={
  origin: env.CLIENT_URL, 
  credentials: true              
}
app.use(cookieParser());
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
   const statusCode = err.statusCode || 500;
 res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});


export default app;