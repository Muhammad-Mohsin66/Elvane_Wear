import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a local file to Cloudinary and returns the secure URL
 * Falls back gracefully if Cloudinary credentials are missing
 * @param {string} filePath - Path to file on disk
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<string|null>} - Cloudinary secure_url
 */
export const uploadFileToCloudinary = async (filePath, folder = 'elvena_wear/products') => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    return null;
  }
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    throw error;
  }
};

export default cloudinary;
