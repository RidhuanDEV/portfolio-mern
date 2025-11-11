import { motion as Motion } from "framer-motion";
import React from "react";
import NavBar from "../components/NavBar";

const ProjectPage = () => {
  return (
    <>
      <main className="w-full min-h-screen pt-12">
      <NavBar />
        <Motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
        >
          ProjectPage
        </Motion.div>
      </main>
    </>
  );
};

export default ProjectPage;
