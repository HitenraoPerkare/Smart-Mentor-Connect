import { useState, useEffect, useRef } from "react";

export default function Navbar({ 
  currentPage, 
  onNavigate, 
  isAuthenticated, 
  currentUser, 
  onLogout,
  triggerToast 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleNavClick = (page) => {
    onNavigate(page);
    setIsOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const bgColors = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-indigo-500 to-blue-600",
  ];
  
  const getAvatarBg = (name) => {
    if (!name) return bgColors[0];
    const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return bgColors[sum % bgColors.length];
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

          {/* Desktop User Status / Login Button */}
          <div className="hidden md:flex items-center gap-4 relative">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                  Welcome, <span className="font-bold text-slate-700">{currentUser?.fullName || currentUser?.name}</span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wide border ${
                    currentUser?.role === "Mentor" 
                      ? "bg-purple-50 text-purple-700 border-purple-100" 
                      : "bg-blue-50 text-blue-700 border-blue-100"
                  }`}>
                    {currentUser?.role}
                  </span>
                </span>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarBg(currentUser?.fullName || currentUser?.name)} text-white font-extrabold flex items-center justify-center text-sm shadow-md cursor-pointer hover:shadow transition-all`}
                  >
                    {getInitials(currentUser?.fullName || currentUser?.name)}
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-fade-in text-left">
                      <div className="px-4 py-2 border-b border-slate-50">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                        <p className="text-xs font-bold text-slate-800 truncate">{currentUser?.fullName || currentUser?.name}</p>
                        <p className="text-[9px] text-slate-400 font-semibold truncate capitalize">{currentUser?.role}</p>
                      </div>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onNavigate("my-profile");
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        My Profile
                      </button>
                      <div className="border-t border-slate-50 my-1" />
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50/50 transition-colors cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button 
                onClick={() => handleNavClick("login")}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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

          {/* Mobile User Profile Section */}
          {isAuthenticated ? (
            <div className="pt-4 border-t border-slate-100 space-y-3 text-left">
              <div className="flex items-center gap-3 px-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarBg(currentUser?.fullName || currentUser?.name)} text-white font-extrabold flex items-center justify-center text-sm`}>
                  {getInitials(currentUser?.fullName || currentUser?.name)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800 text-sm">{currentUser?.fullName || currentUser?.name}</h4>
                    <span className={`px-2 py-0.5 text-[8px] font-bold rounded-md uppercase tracking-wide border ${
                      currentUser?.role === "Mentor" 
                        ? "bg-purple-50 text-purple-700 border-purple-100" 
                        : "bg-blue-50 text-blue-700 border-blue-100"
                    }`}>
                      {currentUser?.role}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold truncate">{currentUser?.email}</p>
                </div>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate("my-profile");
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-rose-500 hover:bg-rose-50/50 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100">
              <button 
                onClick={() => handleNavClick("login")}
                className="w-full text-center px-4 py-2.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
              >
                Login
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
