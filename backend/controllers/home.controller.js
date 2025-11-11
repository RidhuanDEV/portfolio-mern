import { Home } from "../models/home.model.js";

export const getHome = async (req, res) => {
  try {
    const userId = req.userId; // dari verifyToken middleware

    // Fetch home untuk user ini
    const home = await Home.findOne({ user: userId });

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
        download_cv: home.download_cv,
        facebook_url: home.facebook_url,
        instagram_url: home.instagram_url,
        linkedin_url: home.linkedin_url,
        github_url: home.github_url,
        offer_url: home.offer_url,
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
