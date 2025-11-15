// Script to check if CV files exist on Cloudinary and fix URLs
import mongoose from "mongoose";
import { Home } from "../models/home.model.js";
import { checkResourceExists } from "../utils/cloudinary.utils.js";
import dotenv from "dotenv";

dotenv.config();

const checkAndFixCvUrls = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find all home documents with CV URLs
    const homes = await Home.find({
      download_cv: { $exists: true, $ne: null },
    });

    console.log(`Found ${homes.length} home documents with CV URLs`);

    for (const home of homes) {
      const cvUrl = home.download_cv;
      console.log(`\nChecking CV for home document ${home._id}`);
      console.log(`Current URL: ${cvUrl}`);

      if (cvUrl.includes("cloudinary.com")) {
        // Extract public ID from Cloudinary URL
        const urlParts = cvUrl.split("/");
        const uploadIndex = urlParts.findIndex((part) => part === "upload");
        if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
          const publicIdWithExtension = urlParts
            .slice(uploadIndex + 2)
            .join("/");
          const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ""); // Remove extension

          console.log(`Public ID: ${publicId}`);

          // Check if it exists as image
          const imageCheck = await checkResourceExists(publicId, "image");
          if (imageCheck.exists) {
            console.log("✅ File exists as image resource");
            console.log(`Format: ${imageCheck.resource.format}`);
            console.log(`Resource type: ${imageCheck.resource.resource_type}`);

            // For PDFs stored as images, the URL should work as-is
            if (imageCheck.resource.format === "pdf") {
              console.log("PDF stored as image - URL should work");
            }
            continue;
          }

          // Check if it exists as raw
          const rawCheck = await checkResourceExists(publicId, "raw");
          if (rawCheck.exists) {
            console.log("✅ File exists as raw resource");
            console.log(`Format: ${rawCheck.resource.format}`);
            console.log(`Resource type: ${rawCheck.resource.resource_type}`);

            // Update URL to use /raw/upload/
            const rawUrl = cvUrl.replace("/image/upload/", "/raw/upload/");
            await Home.updateOne(
              { _id: home._id },
              { $set: { download_cv: rawUrl } }
            );
            console.log(`Updated URL to: ${rawUrl}`);
            continue;
          }

          console.log("❌ File not found on Cloudinary");
        }
      }
    }
  } catch (error) {
    console.error("Error checking CV URLs:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
checkAndFixCvUrls();
