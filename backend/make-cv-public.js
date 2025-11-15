// Script to make existing CV files public on Cloudinary
import mongoose from "mongoose";
import { Home } from "./models/home.model.js";
import { User } from "./models/user.model.js";
import { makeResourcePublic } from "./utils/cloudinary.utils.js";
import dotenv from "dotenv";

dotenv.config();

const makeCvFilesPublic = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find user
    const user = await User.findOne({ email: "ridhuandf1@gmail.com" });
    if (!user) {
      console.log("User not found");
      return;
    }

    // Find home data
    const home = await Home.findOne({ user: user._id });
    if (!home || !home.download_cv) {
      console.log("No CV found in home data");
      return;
    }

    console.log("Current CV URL:", home.download_cv);

    // Extract public ID from Cloudinary URL
    if (home.download_cv.includes("cloudinary.com")) {
      const urlParts = home.download_cv.split("/");
      console.log("URL parts:", urlParts);

      const uploadIndex = urlParts.findIndex((part) => part === "upload");
      console.log("Upload index:", uploadIndex);

      if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
        const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join("/");
        const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ""); // Remove extension

        console.log("Public ID with extension:", publicIdWithExtension);
        console.log("Public ID:", publicId);

        // Make the resource public
        try {
          console.log("Attempting to make resource public...");
          const result = await makeResourcePublic(publicId, "image");
          console.log("✅ Successfully made CV file public");
          console.log("Result:", JSON.stringify(result, null, 2));
        } catch (error) {
          console.error("❌ Failed to make CV file public:", error.message);
          console.error("Error details:", error);
        }
      } else {
        console.log("Could not extract public ID from URL");
      }
    } else {
      console.log("CV URL is not a Cloudinary URL");
    }
  } catch (error) {
    console.error("Database error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
makeCvFilesPublic();
