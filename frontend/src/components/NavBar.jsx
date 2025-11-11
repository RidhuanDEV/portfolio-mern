import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const NavBar = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { isLoading, logout } = useAuthStore();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const linkBase =
    "px-3 py-2 rounded-md text-sm font-medium transition hover:underline";
  const primaryBtn =
    "text-green-400 rounded-lg px-2 py-1 border hover:text-white hover:border-white active:scale-95 transition";
  const dangerBtn =
    "cursor-pointer text-red-500 rounded-lg px-2 py-1 border border-red-500 hover:text-white hover:border-white active:scale-95 transition";

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-1000 backdrop-blur",
        scrolled ? "bg-gray-900/50 shadow-md w-[80%] mx-auto rounded-b-2xl" : "bg-gray-900",
      ].join(" ")}
    >
      <nav className=" w-[92%] md:w-[90%] mx-auto rounded-b-xl">
        <div className="flex items-center h-16 text-white justify-between px-4 md:px-6">
          {/* Brand */}
          <Link to="/" className="flex items-center font-semibold text-lg">
            <span className="text-green-500">Dy</span>namic
          </Link>

          {/* Toggle (Mobile) */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Open main menu</span>
            {!open ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-10">
            <ul className="flex items-center gap-2">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/projects", label: "Projects" },
              ].map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? "underline underline-offset-4 text-green-400" : ""}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <Link to="/profile" className={primaryBtn}>
                Profile
              </Link>
              <button onClick={logout} className={dangerBtn} disabled={isLoading}>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          id="mobile-menu"
          className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-2 border-t border-white">
            <nav className="flex flex-col">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/projects", label: "Projects" },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block ${linkBase} ${isActive ? "underline underline-offset-4 text-green-400" : "text-white"}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex gap-3 pt-2">
              <Link to="/profile" onClick={() => setOpen(false)} className={`${primaryBtn} flex-1 text-center`}>
                Profile
              </Link>
              <Link to="/logout" onClick={() => setOpen(false)} className={`${dangerBtn} flex-1 text-center`}>
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
