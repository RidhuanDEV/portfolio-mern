import { Home } from "../models/home.model.js";
import { User } from "../models/user.model.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Helper function to save CV locally
const saveCvLocally = (file, userId) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const uploadsDir = path.join(__dirname, "..", "uploads", "cv");

  // Ensure uploads/cv directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Generate unique filename with user ID
  const fileExtension = path.extname(file.originalname);
  const filename = `cv_${userId}_${Date.now()}${fileExtension}`;
  const filePath = path.join(uploadsDir, filename);

  // Move file from temp to uploads/cv
  fs.renameSync(file.path, filePath);

  // Return relative path for serving
  return `/uploads/cv/${filename}`;
};

//gethome untuk fungsi all user (view) - tanpa autentikasi, berdasarkan email
export const getHome = async (req, res) => {
  try {
    const { email } = req.query; // ambil email dari query param

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch home untuk user ini
    const home = await Home.findOne({ user: user._id });

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Home data not found",
      });
    }

    // Response: return home data
    res.status(200).json({
      success: true,
      data: {
        hobbies: home.hobbies,
        intro: home.intro,
        profile_picture_url: home.profile_picture_url,
        download_cv: home.download_cv, // No need to fix URL since it's local
        facebook_url: home.facebook_url,
        instagram_url: home.instagram_url,
        linkedin_url: home.linkedin_url,
        github_url: home.github_url,
        offer_title: home.offer_title,
        offers: home.offers || [],
        description: home.description,
      },
    });
  } catch (error) {
    console.error("Error fetching home:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Edit home data - perlu autentikasi
// Now handles file uploads directly
export const updateHome = async (req, res) => {
  try {
    const userId = req.userId; // dari verifyToken
    let updateData = {};

    console.log("Received request body:", req.body);
    console.log("Received files:", req.files ? req.files.length : 0);

    // Handle multipart form data
    if (req.body && typeof req.body === "object") {
      // Parse JSON strings back to objects
      if (req.body.hobbies) {
        updateData.hobbies = JSON.parse(req.body.hobbies);
      }
      if (req.body.offers) {
        updateData.offers = JSON.parse(req.body.offers);
      }

      // Add other text fields
      updateData.intro = req.body.intro;
      updateData.facebook_url = req.body.facebook_url;
      updateData.instagram_url = req.body.instagram_url;
      updateData.linkedin_url = req.body.linkedin_url;
      updateData.github_url = req.body.github_url;
      updateData.offer_title = req.body.offer_title;
    }

    // Handle file uploads
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      console.log("Processing file uploads...");

      // Upload profile picture
      const profilePicture = req.files.find(
        (file) => file.fieldname === "profile_picture"
      );
      if (profilePicture) {
        try {
          const profileFolder = req.body.profile_picture_folder || "profile";
          console.log("Uploading profile picture to folder:", profileFolder);
          const profileResult = await uploadToCloudinary(
            profilePicture.path,
            profileFolder
          );
          updateData.profile_picture_url = profileResult.url;
          console.log("Profile picture uploaded:", profileResult.url);
        } catch (uploadError) {
          console.error("Profile picture upload failed:", uploadError);
          // Don't fail the whole request, just log the error
        }
      }

      // Upload CV - Save locally instead of Cloudinary
      const downloadCv = req.files.find(
        (file) => file.fieldname === "download_cv"
      );
      if (downloadCv) {
        try {
          console.log("Saving CV locally...");
          const cvPath = saveCvLocally(downloadCv, userId);
          updateData.download_cv = cvPath;
          console.log("CV saved locally:", cvPath);
        } catch (uploadError) {
          console.error("CV save failed:", uploadError);
          // Don't fail the whole request, just log the error
        }
      }
    } else {
      console.log("No files to upload");
    }

    // Validate offers array if provided
    if (updateData.offers && Array.isArray(updateData.offers)) {
      if (updateData.offers.length > 3) {
        return res.status(400).json({
          success: false,
          message: "Maximum 3 offers allowed",
        });
      }

      // Ensure each offer has required fields
      for (const offer of updateData.offers) {
        if (!offer.image_url || !offer.description) {
          return res.status(400).json({
            success: false,
            message: "Each offer must have image_url and description",
          });
        }
      }
    }

    console.log("Update data:", updateData);

    // Update home untuk user ini
    const home = await Home.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true, upsert: true } // upsert jika belum ada
    );

    console.log("Updated home:", home);

    res.status(200).json({
      success: true,
      message: "Home data updated successfully",
      data: home,
    });
  } catch (error) {
    console.error("Error updating home:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
