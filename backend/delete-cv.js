// Script to delete the problematic CV file from Cloudinary
import mongoose from "mongoose";
import { Home } from "./models/home.model.js";
import { User } from "./models/user.model.js";
import { deleteFromCloudinary } from "./utils/cloudinary.utils.js";
import dotenv from "dotenv";

dotenv.config();

const deleteProblematicCv = async () => {
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
      const uploadIndex = urlParts.findIndex((part) => part === "upload");
      if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
        const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join("/");
        const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ""); // Remove extension

        console.log("Public ID:", publicId);

        // Delete the file from Cloudinary
        try {
          const result = await deleteFromCloudinary(publicId);
          console.log("✅ Successfully deleted CV file from Cloudinary");
          console.log("Result:", result);
        } catch (error) {
          console.error("❌ Failed to delete CV file:", error.message);
        }

        // Clear the CV URL from database
        await Home.updateOne({ _id: home._id }, { $unset: { download_cv: 1 } });
        console.log("Cleared CV URL from database");
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
deleteProblematicCv();
