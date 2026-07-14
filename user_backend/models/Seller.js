import mongoose from "mongoose";
import bcrypt from "bcryptjs"
const sellerSchema = new mongoose.Schema({
    ownername:{
        type:String,
        required:[true,"Please enter your name"]
    },
    shopname:{
        type:String,
        required:[true,"Please enter your shop name"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true
    },
    phone:{
        type:String,
        required:[true,"Please enter your phone number"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Please enter your password"]
    },
    role:{
        type:String,
        default:"seller"
    },
    logo:{
        type:String,
    },
    description:{
        type:String,
        trim: true,
    },
    address:{
        type:String,
        trim: true,
    },
    city:{
        type:String,
        trim: true,
    },
    state:{
        type:String,
        trim: true,
    },
    country:{
        type:String,
        trim: true,

    },
    pincode:{
        type:String,
        trim: true,
    },
    gstNumber:{
        type:String
    },
    status: {
    type: String,
    enum: [
      "Pending",
      "Approved",
      "Rejected"
    ],
    default: "Pending"
   },
   
  isBlocked: {
    type: Boolean,
    default: false
  },
  

  idProof: {
  front: {
    type: String,
    required: true
  },
  back: {
    type: String,
    required: true
  }

  },
  

},{timestamps:true})

sellerSchema.pre("save", async function () {


  if (!this.isModified("password")) return ;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});

sellerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const Seller=mongoose.model("Seller",sellerSchema)
export default Seller