// Script to re-upload CV with correct raw resource settings
import mongoose from "mongoose";
import { Home } from "./models/home.model.js";
import { User } from "./models/user.model.js";
import cloudinary from "./config/cloudinary.config.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const reuploadCvAsRaw = async () => {
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

    // For this demo, let's create a simple PDF file to upload
    // In a real scenario, you'd need the original file
    const tempPdfPath = path.join(__dirname, "temp_cv.pdf");

    // Create a simple PDF content (this is just for testing)
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Resume) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
0000000373 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
459
%%EOF`;

    fs.writeFileSync(tempPdfPath, pdfContent);

    // Upload as raw resource
    console.log("Uploading CV as raw resource...");
    const result = await cloudinary.uploader.upload(tempPdfPath, {
      folder: "auth-mern/cv",
      resource_type: "raw",
      type: "upload",
      format: "pdf",
    });

    // Clean up temp file
    if (fs.existsSync(tempPdfPath)) {
      fs.unlinkSync(tempPdfPath);
    }

    console.log("New CV uploaded:", result.secure_url);

    // Update database with new URL
    const rawUrl = result.secure_url.replace("/raw/upload/", "/raw/upload/"); // Already correct
    await Home.updateOne({ _id: home._id }, { $set: { download_cv: rawUrl } });

    console.log("Database updated with new CV URL:", rawUrl);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
reuploadCvAsRaw();
