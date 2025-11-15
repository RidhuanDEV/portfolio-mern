// Script to re-upload CV with correct settings
import mongoose from "mongoose";
import { Home } from "../models/home.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const reuploadCv = async () => {
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

    // For now, let's just update the URL format if it's using /raw/upload/
    // PDFs uploaded as images should use /image/upload/
    if (home.download_cv.includes("/raw/upload/")) {
      const correctedUrl = home.download_cv.replace(
        "/raw/upload/",
        "/image/upload/"
      );
      await Home.updateOne(
        { _id: home._id },
        { $set: { download_cv: correctedUrl } }
      );
      console.log("Corrected CV URL to:", correctedUrl);
    } else {
      console.log("CV URL format looks correct");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
reuploadCv();
