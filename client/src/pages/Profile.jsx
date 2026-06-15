import MentorDashboard from "../components/MentorDashboard";

export default function Profile({ currentUser, onNavigate }) {
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
            </>
          )}

        </div>
      </div>
    </div>
  );
}
