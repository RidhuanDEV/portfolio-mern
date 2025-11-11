import { About } from '../models/about.model.js';

export const getAbout = async (req, res) => {
  try {
    const userId = req.userId; // dari verifyToken middleware
    const about = await About.findOne({ user: userId });
    if (!about) {
      return res.status(404).json({ message: "About not found" });
    }
    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
