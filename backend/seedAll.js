// seedAll.js - Script untuk menambahkan data awal ke database
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "./models/user.model.js";
import { Home } from "./models/home.model.js";
import { About } from "./models/about.model.js";
import { Proyek } from "./models/proyek.model.js";

dotenv.config();

const sampleUser = {
  email: "ridhuandf1@gmail.com",
  password: "password123", // akan di-hash
  name: "Ridhuan",
  isVerified: true,
};

const sampleHome = {
  hobbies: ["Frontend Developer", "Backend Developer", "Web Developer"],
  intro:
    "Hi, I'm Ridhuan, a passionate full-stack developer with expertise in MERN stack. I love creating beautiful and functional web applications.",
  profile_picture_url:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  download_cv: "https://example.com/cv.pdf", // Ganti dengan URL CV asli
  facebook_url: "https://facebook.com/ridhuandev",
  instagram_url: "https://instagram.com/ridhuandev",
  linkedin_url: "https://linkedin.com/in/ridhuandev",
  github_url: "https://github.com/RidhuanDEV",
  offer_title: "What I Offer",
  offers: [
    {
      image_url:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop",
      description: "Full-stack web development with modern technologies",
    },
    {
      image_url:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
      description: "Responsive and mobile-first design",
    },
    {
      image_url:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
      description: "API development and integration",
    },
  ],
  description:
    "I specialize in creating end-to-end solutions for web applications, from concept to deployment.",
};

const sampleAbout = {
  self_description: [
    "I'm a dedicated full-stack developer with 2+ years of experience in web development.",
    "I have a strong foundation in both frontend and backend technologies, with a passion for creating user-friendly applications.",
    "When I'm not coding, I enjoy learning new technologies and contributing to open-source projects.",
  ],
  people_title: ["John Doe", "Jane Smith"],
  people_opinion: [
    "Ridhuan is an excellent developer who delivers high-quality work on time.",
    "Great to work with, very professional and skilled in modern web technologies.",
  ],
  people_url: [
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
  ],
  experience_title: ["Frontend Developer", "Backend Developer"],
  experience_location: ["Jakarta, Indonesia", "Remote"],
  experience_desc: [
    "Developed responsive web applications using React and modern CSS frameworks.",
    "Built RESTful APIs and integrated with various databases including MongoDB.",
  ],
  experience_time: ["2022 - Present", "2021 - 2022"],
  tools_name: [
    "React",
    "Node.js",
    "MongoDB",
    "Express",
    "JavaScript",
    "TypeScript",
  ],
  tools_icon: [
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  ],
};

const sampleProjects = [
  {
    photo_url:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop",
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce platform built with MERN stack featuring user authentication, product management, shopping cart, and payment integration.",
    project_url: "https://github.com/RidhuanDEV/ecommerce-platform",
  },
  {
    photo_url:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
    title: "Task Management App",
    description:
      "A collaborative task management application with real-time updates, team collaboration features, and progress tracking.",
    project_url: "https://github.com/RidhuanDEV/task-manager",
  },
  {
    photo_url:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
    title: "Weather Dashboard",
    description:
      "A responsive weather dashboard that displays current weather conditions and forecasts using OpenWeatherMap API.",
    project_url: "https://github.com/RidhuanDEV/weather-dashboard",
  },
  {
    photo_url:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&h=300&fit=crop",
    title: "Portfolio Website",
    description:
      "A modern, responsive portfolio website showcasing projects, skills, and experience with smooth animations and interactive elements.",
    project_url: "https://github.com/RidhuanDEV/portfolio-website",
  },
  {
    photo_url:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop",
    title: "Chat Application",
    description:
      "Real-time chat application with multiple chat rooms, private messaging, and file sharing capabilities using Socket.io.",
    project_url: "https://github.com/RidhuanDEV/chat-app",
  },
  {
    photo_url:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
    title: "Blog Platform",
    description:
      "A full-featured blog platform with user authentication, rich text editor, comments system, and admin dashboard.",
    project_url: "https://github.com/RidhuanDEV/blog-platform",
  },
];

async function seedAll() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Seed User
    let user = await User.findOne({ email: sampleUser.email });
    if (!user) {
      const hashedPassword = await bcrypt.hash(sampleUser.password, 10);
      user = new User({
        ...sampleUser,
        password: hashedPassword,
      });
      await user.save();
      console.log(`User created: ${user.email}`);
    } else {
      console.log(`User already exists: ${user.email}`);
    }

    // Seed Home
    let home = await Home.findOne({ user: user._id });
    if (!home) {
      home = new Home({
        ...sampleHome,
        user: user._id,
      });
      await home.save();
      console.log("Home data created");
    } else {
      console.log("Home data already exists");
    }

    // Seed About
    let about = await About.findOne({ user: user._id });
    if (!about) {
      about = new About({
        ...sampleAbout,
        user: user._id,
      });
      await about.save();
      console.log("About data created");
    } else {
      console.log("About data already exists");
    }

    // Seed Projects
    const existingProjects = await Proyek.find({ user: user._id });
    if (existingProjects.length === 0) {
      const projectsToInsert = sampleProjects.map((project) => ({
        ...project,
        user: user._id,
      }));
      const insertedProjects = await Proyek.insertMany(projectsToInsert);
      console.log(`Successfully inserted ${insertedProjects.length} projects`);
    } else {
      console.log(
        `Found ${existingProjects.length} existing projects. Skipping seed.`
      );
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

// Run the seed function
seedAll();
