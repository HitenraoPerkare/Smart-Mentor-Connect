import { useState, useEffect } from "react";
import MentorDashboard from "../components/MentorDashboard";
import { fetchApi } from "../utils/api";

export default function Profile({ currentUser, onNavigate }) {
  const [googleSuccess, setGoogleSuccess] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [connectingGoogle, setConnectingGoogle] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("google") === "connected") {
      setGoogleSuccess("Google Calendar successfully connected!");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleConnectGoogle = async () => {
    try {
      setConnectingGoogle(true);
      setGoogleError("");
      const res = await fetchApi("/calendar/auth");
      if (res.authUrl) {
        window.location.href = res.authUrl;
      }
    } catch (err) {
      setGoogleError(err.message || "Failed to start Google Calendar connection.");
      setConnectingGoogle(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
        <div className="max-w-md w-full px-6 text-center">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-800">No profile found</h2>
            <p className="text-xs text-slate-500">Please sign in to view your profile details.</p>
            <button
              onClick={() => onNavigate("login")}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

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

  const formattedDate = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not Available";

  return (
    <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        
        {/* Card Wrapper */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-100/80 space-y-6 text-left">
          
          {/* Back Button */}
          <button
            onClick={() => onNavigate("home")}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>

          {/* User Profile Header */}
          <div className="flex flex-col items-center text-center space-y-4 pt-2">
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${getAvatarBg(currentUser.fullName || currentUser.name)} text-white font-extrabold flex items-center justify-center text-3xl shadow-md`}>
              {getInitials(currentUser.fullName || currentUser.name)}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                {currentUser.fullName || currentUser.name}
              </h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">Personal Profile</p>
            </div>
          </div>

          <div className="border-t border-slate-100 my-4" />

          {/* Profile Details List */}
          <div className="space-y-4">
            
            {/* Email Address */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Email Address
              </span>
              <span className="text-sm font-bold text-slate-700 block mt-1">
                {currentUser.email}
              </span>
            </div>

            {/* Role Badge */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Role
                </span>
                <span className="text-sm font-bold text-slate-700 block mt-1">
                  {currentUser.role}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                currentUser.role === "Mentor" 
                  ? "bg-purple-50 text-purple-700 border border-purple-100" 
                  : "bg-blue-50 text-blue-700 border border-blue-100"
              }`}>
                {currentUser.role}
              </span>
            </div>

            {/* Account Created Date */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Member Since
              </span>
              <span className="text-sm font-bold text-slate-700 block mt-1">
                {formattedDate}
              </span>
            </div>

          </div>

          <div className="border-t border-slate-100 my-4" />

          {currentUser.role === "mentor" ? (
            <MentorDashboard currentUser={currentUser} onNavigate={onNavigate} />
          ) : (
            <>
              {/* Google Calendar connection notifications */}
              {googleSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs font-semibold text-emerald-700">{googleSuccess}</span>
                </div>
              )}
              {googleError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                  <span className="text-xs font-semibold text-red-600">{googleError}</span>
                </div>
              )}

              {/* Navigation Buttons for students */}
              <div className="flex gap-3">
                <button
                  onClick={() => onNavigate("mentors")}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow hover:shadow-md transition-all duration-200 text-xs cursor-pointer text-center"
                >
                  Find Mentors
                </button>
                <button
                  onClick={() => onNavigate("become-mentor")}
                  className="flex-1 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  Become a Mentor
                </button>
              </div>

              {/* Connect Google Calendar */}
              <button
                onClick={handleConnectGoogle}
                disabled={connectingGoogle}
                className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-600 font-semibold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {connectingGoogle ? "Connecting…" : "Connect Google Calendar"}
              </button>

              <p className="text-[10px] text-slate-400 text-center">
                Linking your calendar lets us check for scheduling conflicts before you book a session.
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
