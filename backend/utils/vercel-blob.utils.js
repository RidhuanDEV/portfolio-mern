import { put, del } from "@vercel/blob";
import path from "path";
import fs from "fs";

// Utility functions for Vercel Blob storage
export const uploadToVercelBlob = async (filePath, folder = "uploads") => {
  try {
    const fileName = path.basename(filePath);
    const blobPath = `${folder}/${Date.now()}-${fileName}`;

    // Read file content
    const fileContent = fs.readFileSync(filePath);

    const blob = await put(blobPath, fileContent, {
      access: "public",
      contentType: "application/pdf", // Explicitly set content type for PDF
    });

    return {
      success: true,
      url: blob.url,
      pathname: blob.pathname,
    };
  } catch (error) {
    console.error("Vercel Blob upload error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

export const deleteFromVercelBlob = async (url) => {
  try {
    await del(url);
    return {
      success: true,
    };
  } catch (error) {
    console.error("Vercel Blob delete error:", error);
    throw new Error(`Delete failed: ${error.message}`);
  }
};
