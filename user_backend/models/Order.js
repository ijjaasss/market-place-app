import mongoose from "mongoose";

const orderSchema=mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },

      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller"
      },

      quantity: {
        type:Number,
        min:1
      },

      price: {
        type:Number,
        min:0
      }
    }
  ],

  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },

  totalAmount: {
    type:Number,
    min:0
  },

  paymentMethod: {
    type: String,
    enum: [
      "COD",
      "Online"
    ]
  },

  paymentStatus: {
    type: String,
    enum: [
      "Pending",
      "Paid",
      "Failed"
    ],
    default: "Pending"
  },

  orderStatus: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "Packed",
      "Shipped",
      "Delivered",
      "Cancelled"
    ],
    default: "Pending"
  }
},{timestamps:true})

const Order=mongoose.model("Order",orderSchema)
export default Order