import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "studyhive/profilePics",
    });

    // delete local file
    fs.unlinkSync(filePath);

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };

  } catch (error) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.log("Cloudinary upload error:", error);
    return null;
  }
};

export default uploadOnCloudinary;