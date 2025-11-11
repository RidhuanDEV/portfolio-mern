import { motion as Motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import NavBar from "../components/NavBar.jsx";
import Card from "../components/Card.jsx";
import React, { useEffect, useRef } from "react";
import { useDataStore } from "../store/useDataStore.js";
import { Loader } from "lucide-react";

const offers = [
  {
    title: "Professional UI/UX Design",
    imageSrc: "./uiux.jpeg",
    description: "Pros Never FAKE",
  },
  {
    title: "Web Development",
    imageSrc: "./web.jpeg",
    description: "Building Responsive Websites",
  },
  {
    title: "Mobile App Development",
    imageSrc: "./mobile.jpeg",
    description: "Creating User-Friendly Mobile Apps",
  },
];

const DashboardPage = () => {
  const { user } = useAuthStore();

  // Ambil state & action via hook (bukan getState)
  const isLoading = useDataStore((store) => store.isLoading);
  const home = useDataStore((store) => store.home);
  const error = useDataStore((store) => store.error);
  const message = useDataStore((store) => store.message);
  const homeData = useDataStore((store) => store.homeData);

  const fetchedRef = useRef(false);
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    homeData(); // <-- tanpa argumen
  }, [user?._id, homeData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader className="animate-spin text-green-500" size={48} />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-900">
        <p className="text-red-500 text-lg">
          {message || "An error occurred."}
        </p>
      </div>
    );
  }

  return (
    <main className="w-full h-[2000px] pt-12">
      <NavBar></NavBar>

      <section>
        <div className="grid grid-cols-3 min-h-screen gap-4 p-4 mt-4">
          <div className="col-span-2">
            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="h-full ml-24 p-8 bg-gray-900/90 bg-opacity-20 backdrop-blur-lg rounded-xl shadow-2xl w-3/4 hover:border hover:border-green-400 transition-all duration-500 relative"
            >
              <h2 className="text-2xl font-bold text-white bg-clip-text">
                Hello Buds,
              </h2>
              <h4 className="text-4xl font-medium mb-2 text-gray-300">
                I am <span className="text-green-400">{user.name}</span> !
              </h4>
              <h5 className="text-lg font-base mb-2 text-white/70">
                {home?.hobbies?.join(", ") ||
                  "UI /UX Designer & Frontend Developer"}
                .
              </h5>
              <div className="text-transparent border-b-2 mb-8 border-green-400 w-fit pointer-events-none select-none">
                cuma garis biasa aja
              </div>
              <div className="space-y-6">
                <Motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-lg font-light text-white mb-3 px-4">
                    I am a passionate UI/UX designer and frontend developer with
                    a knack for creating visually stunning and user-friendly
                    digital experiences. With a strong foundation in design
                    principles and a keen eye for detail, I specialize in
                    crafting intuitive interfaces that captivate users and drive
                    engagement.
                  </p>
                </Motion.div>
              </div>
              <div className="absolute bottom-0 mb-6">
                <Motion.button
                  className="mt-5 mb-4 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold
                            rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500
                            focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Download Resume
                </Motion.button>
                <div>
                  <p className="text-sm font-light text-white/70">
                    Get in touch with me for collaboration or just a friendly
                    chat!
                  </p>
                </div>
              </div>
            </Motion.div>
          </div>

          <div className="col-span-1 rounded-xl">
            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex flex-col items-center mr-24 rotate-8 hover:rotate-0 transition-transform duration-500">
                <div className="w-96 h-96 mt-10 overflow-hidden rounded-2xl border-2 border-green-500 shadow-lg">
                  <img
                    src="./profilsaya.jpg"
                    alt="Profile"
                    className="text-white w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
            </Motion.div>
          </div>
          <div className="col-span-3 p-8 mb-16 flex justify-center items-center">
            <Motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="h-3/4"
            >
              <div className="flex gap-8 px-8 py-2 items-center justify-center bg-gray-900 shadow-2xl rounded-xl hover:scale-105 transition-transform duration-500">
                <h3 className="text-white font-light p-2">Find me on: </h3>
                <ul className="flex space-x-6">
                  <li>
                    <a
                      href="https://www.linkedin.com/in/yourprofile"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="./icons8-linkedin.svg"
                        alt="LinkedIn"
                        className="w-8 h-8 hover:scale-110 transition-transform duration-300"
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/yourprofile"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="./icons8-github.svg"
                        alt="GitHub"
                        className="w-8 h-8 hover:scale-110 transition-transform duration-300"
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/yourprofile"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="./icons8-facebook.svg"
                        alt="Facebook"
                        className="w-8 h-8 hover:scale-110 transition-transform duration-300"
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/yourprofile"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="./icons8-instagram.svg"
                        alt="Instagram"
                        className="w-8 h-8 hover:scale-110 transition-transform duration-300"
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </Motion.div>
          </div>
        </div>
      </section>
      {/* Section Offer */}
      <section>
        <div className="max-w-4xl mx-auto p-8 bg-gray-900 bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 mb-16">
          <h2 className="text-sm font-light mb-4 text-center text-white">
            What Do I <span className="text-green-400">Offer</span>
          </h2>
          {home?.offer_url && home?.description && home?.offer_title ? (
            <>
              <div className="col-span-3 text-center flex justify-center mb-10">
                <h2 className="text-white text-xl w-1/2">{home.offer_title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex justify-center">
                  <Card
                    imageSrc={home.offer_url ? home.offer_url : ""}
                    imageAlt="Offer"
                    description={home.description ? home.description : ""}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="col-span-3 text-center flex justify-center mb-10">
                <h2 className="text-white text-xl w-1/2">
                  example : Creates Professional UI UX Design That Oriented
                  Toward's Client Needs.
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {offers.map((offer, index) => (
                  <div className="flex justify-center">
                    <Card
                      key={index}
                      imageSrc={offer.imageSrc}
                      imageAlt={offer.title}
                      description={offer.description}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      {/* Section if you have any project in minds ? */}
      <section>
        <div className="max-w-4xl mx-auto p-8 bg-gray-900 bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 mb-16">
          <h2 className="text-sm font-light mb-4 text-center text-white">
            Have Any <span className="text-green-400">Project</span> in Minds ?
          </h2>
        </div>
      </section>
    </main>
  );
};
export default DashboardPage;
