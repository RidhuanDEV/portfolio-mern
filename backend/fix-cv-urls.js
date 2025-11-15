// Script to fix existing Cloudinary CV URLs in the database
import mongoose from "mongoose";
import { Home } from "../models/home.model.js";
import dotenv from "dotenv";

dotenv.config();

const fixCloudinaryPdfUrl = (url) => {
  if (!url || !url.includes("cloudinary.com")) {
    return url;
  }
  // Replace /image/upload/ with /raw/upload/ for PDF files
  return url.replace("/image/upload/", "/raw/upload/");
};

const updateExistingCvUrls = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find all home documents with CV URLs
    const homes = await Home.find({
      download_cv: { $exists: true, $ne: null },
    });

    console.log(`Found ${homes.length} home documents with CV URLs`);

    let updatedCount = 0;

    for (const home of homes) {
      const originalUrl = home.download_cv;
      const fixedUrl = fixCloudinaryPdfUrl(originalUrl);

      if (originalUrl !== fixedUrl) {
        await Home.updateOne(
          { _id: home._id },
          { $set: { download_cv: fixedUrl } }
        );
        console.log(`Updated CV URL for home document ${home._id}`);
        console.log(`  From: ${originalUrl}`);
        console.log(`  To: ${fixedUrl}`);
        updatedCount++;
      }
    }

    console.log(`Updated ${updatedCount} CV URLs`);
  } catch (error) {
    console.error("Error updating CV URLs:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
updateExistingCvUrls();
