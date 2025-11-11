import { Proyek } from '../models/proyek.model.js';

export const getProyek = async (req, res) => {
  try {
    const userId = req.userId; // dari verifyToken middleware
    const proyek = await Proyek.findOne({ user: userId });
    if (!proyek) {
      return res.status(404).json({ message: "Proyek not found" });
    }
    res.status(200).json(proyek);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const createProyek = async (req, res) => {
  try {
    const userId = req.userId; // dari verifyToken middleware
    const { title, description, link } = req.body;
    const proyek = new Proyek({ user: userId, title, description, link });
    await proyek.save();
    res.status(201).json(proyek);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};