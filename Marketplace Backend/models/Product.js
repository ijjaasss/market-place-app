import mongoose from "mongoose";

const productSchema=mongoose.Schema(
{
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller"
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  name: {
    type:String,
    required:[true,"Please enter product name"]
  },
  description: {
    type:String,
    trim: true
  },

  price: {
    type:Number,
    required:[true,"Please enter price"]
  },


  stock: {
    type:Number,
    required:true,
    min:0
  },

  images: {
      type: [String],
      default: []
  },

  brand: {
      type: String,
      trim: true
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

  isDeleted: {
    type: Boolean,
    default: false
  },
  rejectReason: {
    type: String,
    default: "",
  },

},{timestamps:true})
productSchema.index({
    name:"text",
    brand:"text"
});
const Product=mongoose.model("Product",productSchema)
export default Product