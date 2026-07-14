import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Please enter your name"]
        },
        email:{
            type:String,
            required:[true,"Please enter your email"],
            unique:true,
        },
        password:{
            type:String,
            required:[true,"Please enter your password"]
        },
        role:{
            type:String,
            default:"admin"
        },
        isActive:{
            type:Boolean,
            default:true
        }

    }
)
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const Admin =mongoose.model("Admin",adminSchema)
export default Admin;