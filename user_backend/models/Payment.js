import mongoose from "mongoose";

const paymentSchema=mongoose.Schema(
{
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  amount: {
    type:Number,
    min:0
  },

  paymentMethod: {
    type:String,
    enum: [
      "COD",
      "Online"
    ]
  },

  transactionId: {
    type:String
  },

  status: {
    type: String,
    enum: [
      "Pending",
      "Success",
      "Failed"
    ]
  }
},{timestamps:true})

const Payment=mongoose.model("Payment",paymentSchema)
export default Payment