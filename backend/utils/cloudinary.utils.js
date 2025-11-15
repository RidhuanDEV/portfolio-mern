import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";
import path from "path";

export const uploadToCloudinary = async (filePath, folder = "portfolio") => {
  try {
    // Determine resource type based on file extension
    const fileExtension = path.extname(filePath).toLowerCase();
    const isPdf = fileExtension === ".pdf";
    const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(
      fileExtension
    );

    let resourceType = "auto";
    let uploadOptions = {
      folder: `auth-mern/${folder}`,
      resource_type: resourceType,
      access_mode: "public",
    };

    // Special handling for PDFs
    if (isPdf) {
      uploadOptions.resource_type = "image"; // PDFs can be uploaded as images and accessed via image URLs
      uploadOptions.format = "pdf"; // Explicitly set format
    }

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    // Delete the file from server after upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    // Delete the file if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Upload failed: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error(`Delete failed: ${error.message}`);
  }
};

export const checkResourceExists = async (publicId, resourceType = "image") => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
    });
    return {
      success: true,
      exists: true,
      resource: result,
    };
  } catch (error) {
    if (error.http_code === 404) {
      return {
        success: true,
        exists: false,
      };
    }
    console.error("Cloudinary resource check error:", error);
    throw new Error(`Resource check failed: ${error.message}`);
  }
};
