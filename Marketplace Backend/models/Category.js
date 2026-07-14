import mongoose from "mongoose";

const categorySchema=mongoose.Schema(
    {
  name: {
    type: String,
    unique: true
  },

  image: String,

  isActive: {
    type: Boolean,
    default: true
  }
},{timestamps:true})

const Category=mongoose.model('Category',categorySchema)
export default Category