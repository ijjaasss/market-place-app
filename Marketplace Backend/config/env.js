import dotenv from 'dotenv';
dotenv.config()
export default {
    PORT: process.env.PORT || 8080,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_URL: process.env.CLIENT_URL ,
    ADMIN_URL:process.env.ADMIN_URL,
    MONGODB_URI: process.env.MONGODB_URI ,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET,
    JWT_SECRET:process.env.JWT_SECRET
}