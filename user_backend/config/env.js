import dotenv from 'dotenv';

dotenv.config();

export default {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_URL: process.env.CLIENT_URL ,
    MONGODB_URI: process.env.MONGODB_URI ,
    JWT_SECRET:process.env.JWT_SECRET,
}
