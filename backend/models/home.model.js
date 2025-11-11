import mongoose from "mongoose";

const homeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
      index: true,
    },
    hobbies: {
      type: [String],
      enum: [
        "UI/UX Designer",
        "Frontend Developer",
        "Backend Developer",
        "AI Engineer",
        "Mobile Developer",
        "Web Developer",
      ],
      default: [],
    },
    intro: { type: String, required: true, trim: true, default: null },
    profile_picture_url: { type: String, required: true, trim: true, default: null },
    download_cv: { type: String, required: true, trim: true, default: null },
    facebook_url: { type: String, required: true, trim: true, default: null },
    instagram_url: { type: String, required: true, trim: true, default: null },
    linkedin_url: { type: String, required: true, trim: true, default: null },
    github_url: { type: String, required: true, trim: true, default: null },
    offer_title: {
      type: String,
      required: true,
      trim: true, default: null
    },
    offer_url: {
      type: [String],
      enum: [
        "uiux.jpeg",
        "web.jpeg",
        "mobile.jpeg",
        "backend.jpeg",
        "ai.jpeg",
        "frontend.jpeg",
      ],
      validate: {
        validator: function (v) {
          return v.length <= 3;
        },
        message: "Offer URL hanya boleh berisi maksimal 3 jenis!",
      },
      default: [],
    },
    description: { type: String, default: null },
  },
  { timestamps: true }
);

export const Home = mongoose.model("home", homeSchema);
