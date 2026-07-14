import mongoose from "mongoose";

const reviewSchema=mongoose.Schema(
 {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  rating: {
    type: Number,
    min: 1,
    max: 5
  },

  review: {
    type:String
  },
  status: {
  type: String,
  enum: ["Active", "Hidden"],
  default: "Active",
 },
},{timestamps:true})
reviewSchema.index({ user: 1, product: 1 }, { unique: true });
const Review=mongoose.model("Review",reviewSchema)
export default Review