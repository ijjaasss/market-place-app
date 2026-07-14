import mongoose from "mongoose";
import env from "./env.js";
export const connectDb=async()=>{
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
