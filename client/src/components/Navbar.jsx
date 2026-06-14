import { useState } from "react";

export default function Navbar({ currentPage, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (page) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => handleNavClick("home")} 
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">
              Smart Mentor <span className="text-blue-600">Connect</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavClick("home")}
              className={`font-semibold text-sm transition-colors duration-200 cursor-pointer ${
                currentPage === "home" ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("mentors")}
              className={`font-semibold text-sm transition-colors duration-200 cursor-pointer ${
                currentPage === "mentors" ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
              }`}
            >
              Find Mentors
            </button>
            <a
              href="#features"
              onClick={(e) => {
                if (currentPage !== "home") {
                  handleNavClick("home");
                }
              }}
              className="text-slate-600 hover:text-blue-600 font-semibold text-sm transition-colors duration-200"
            >
              How It Works
            </a>
          </div>

          {/* Desktop Login Button */}
          <div className="hidden md:flex items-center">
            <button className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer">
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => handleNavClick("home")}
            className={`block w-full text-left px-3 py-2 rounded-lg text-base font-semibold transition-colors ${
              currentPage === "home" ? "text-blue-600 bg-blue-50/50" : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("mentors")}
            className={`block w-full text-left px-3 py-2 rounded-lg text-base font-semibold transition-colors ${
              currentPage === "mentors" ? "text-blue-600 bg-blue-50/50" : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
            }`}
          >
            Find Mentors
          </button>
          <a
            href="#features"
            onClick={(e) => {
              if (currentPage !== "home") {
                handleNavClick("home");
              } else {
                setIsOpen(false);
              }
            }}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
          >
            How It Works
          </a>
          <div className="pt-2 border-t border-slate-100">
            <button className="w-full text-center px-4 py-2.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all duration-200 cursor-pointer">
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
