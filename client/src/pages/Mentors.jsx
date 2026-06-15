import { useState, useEffect } from "react";
import { fetchApi } from "../utils/api";

const EXPERTISE_FILTERS = [
  "All",
  "React",
  "Node.js",
  "Python",
  "UI/UX Design",
  "System Design",
  "DevOps",
  "React Native",
];

// Gradient colours cycle for avatars since backend doesn't store this
const AVATAR_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-blue-600",
];

// Derive initials from a name string
const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

export default function Mentors({ isAuthenticated, onSelectMentor, onBookSessionAction }) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("All");

  useEffect(() => {
    const loadMentors = async () => {
      try {
        setLoading(true);
        const data = await fetchApi("/mentors");
        setMentors(data);
      } catch (err) {
        setError(err.message || "Failed to load mentors");
      } finally {
        setLoading(false);
      }
    };
    loadMentors();
  }, []);

  // Normalise API mentor shape for the card UI
  const normaliseMentor = (m, idx) => ({
    id: m._id,
    _id: m._id,
    name: m.userId?.name || "Mentor",
    role: m.bio ? m.bio.split(".")[0] : "Experienced Mentor",
    company: "",
    avatarInitials: getInitials(m.userId?.name),
    avatarBg: AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length],
    expertise: m.expertise || [],
    timezone: m.userId?.timezone || "UTC",
    rating: 4.9,
    reviewsCount: 0,
    rate: 85,
    nextAvailable: m.availability?.length > 0 ? "Available this week" : "No slots yet",
    isOnline: false,
    availability: m.availability || [],
  });

  const normalisedMentors = mentors.map(normaliseMentor);

  // Filter mentors based on search query and expertise
  const filteredMentors = normalisedMentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((exp) => exp.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesExpertise =
      selectedExpertise === "All" ||
      mentor.expertise.some((exp) => exp.toLowerCase() === selectedExpertise.toLowerCase());

    return matchesSearch && matchesExpertise;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Block */}
        <div className="text-left space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Find the Perfect Tech Mentor
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Browse through experienced mentors, schedule a timezone-converted slot, and sync seamlessly.
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm space-y-5">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search mentors by name, role, or specific skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-sm text-slate-800 rounded-2xl outline-none transition-all duration-200"
            />
          </div>

          {/* Filter Pills */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Filter by Expertise
            </div>
            <div className="flex flex-wrap gap-2">
              {EXPERTISE_FILTERS.map((filter) => {
                const isSelected = selectedExpertise === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setSelectedExpertise(filter)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/10"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 border border-slate-200/60"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mentors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-200" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-100 rounded-lg w-16" />
                  <div className="h-6 bg-slate-100 rounded-lg w-20" />
                  <div className="h-6 bg-slate-100 rounded-lg w-14" />
                </div>
                <div className="h-10 bg-slate-100 rounded-2xl w-full mt-4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white border border-rose-100 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
            <div className="p-3.5 bg-rose-50 text-rose-400 rounded-full inline-block">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800">Failed to Load Mentors</h3>
            <p className="text-sm text-slate-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-colors duration-200 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Header & Bio */}
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <div 
                        className="relative cursor-pointer"
                        onClick={() => onSelectMentor(mentor)}
                      >
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mentor.avatarBg} text-white font-extrabold flex items-center justify-center text-lg shadow-sm`}>
                          {mentor.avatarInitials}
                        </div>
                        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${mentor.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      </div>
                      <div 
                        className="cursor-pointer"
                        onClick={() => onSelectMentor(mentor)}
                      >
                        <h3 className="font-bold text-slate-800 text-base hover:text-blue-600 transition-colors duration-200">
                          {mentor.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">{mentor.role}</p>
                        <p className="text-[10px] font-bold text-blue-600">{mentor.company}</p>
                      </div>
                    </div>
                    {/* Rating */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700">
                      <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{mentor.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({mentor.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Expertise Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {mentor.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 text-[10px] font-bold bg-slate-50 text-slate-500 rounded-lg border border-slate-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100 my-5" />

                  {/* Info Row */}
                  <div className="space-y-3">
                    {/* Timezone */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <span>Timezone: <span className="font-semibold text-slate-700">{mentor.timezone}</span></span>
                    </div>

                    {/* Hourly Rate */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4z" />
                      </svg>
                      <span>Hourly Rate: <span className="font-extrabold text-blue-600">${mentor.rate}/hr</span></span>
                    </div>

                    {/* Next Available */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Next Slot: <span className="font-semibold text-emerald-600">{mentor.nextAvailable}</span></span>
                    </div>
                  </div>
                </div>

                {/* Book Session CTA */}
                <div className="mt-6">
                  <button 
                    onClick={() => {
                      if (!isAuthenticated) {
                        onBookSessionAction(mentor);
                      } else {
                        onSelectMentor(mentor);
                      }
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-2xl shadow-md shadow-blue-500/5 hover:shadow-lg transition-all duration-200 text-sm cursor-pointer text-center"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
            <div className="p-3.5 bg-slate-50 text-slate-400 rounded-full inline-block">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Mentors Found</h3>
            <p className="text-sm text-slate-500">
              We couldn't find any mentors matching your search query. Try switching your filters or keywords.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedExpertise("All");
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-colors duration-200 cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
