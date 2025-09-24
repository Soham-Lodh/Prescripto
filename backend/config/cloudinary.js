import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = () => {
  if (
    !process.env.CLOUDINARY_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_SECRET_KEY
  ) {
    console.error("❌ Cloudinary environment variables are missing");
    process.exit(1);
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });

  console.log("✅ Cloudinary configured successfully");
};

export default connectCloudinary;
