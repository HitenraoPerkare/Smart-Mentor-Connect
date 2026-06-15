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

const MOCK_MENTORS = [
  {
    id: 1,
    _id: 1,
    name: "Sarah Chen",
    title: "React Expert & Tech Lead",
    role: "React Expert & Tech Lead",
    company: "Stripe",
    hourlyRate: 85,
    rate: 85,
    rating: 4.9,
    totalReviews: 48,
    reviewsCount: 48,
    expertise: ["React", "UI/UX Design", "TypeScript", "Next.js", "System Design"],
    bio: "Sarah is a frontend specialist and Tech Lead at Stripe with over 8 years of experience building scalable web applications. She is passionate about modern React, state management, design systems, and frontend performance optimization. She loves helping engineers transition from juniors to seniors by breaking down complex rendering and architectural patterns.",
    image: "",
    avatarInitials: "SC",
    avatarBg: "from-blue-500 to-indigo-600",
    timezone: "EDT (UTC-4)",
    nextAvailable: "Tomorrow, 7:00 PM EDT",
    isOnline: true,
    availability: [
      { dayOfWeek: 1, startTime: "19:00", endTime: "22:00" },
      { dayOfWeek: 2, startTime: "17:00", endTime: "18:00" },
      { dayOfWeek: 5, startTime: "21:00", endTime: "22:00" }
    ]
  },
  {
    id: 2,
    _id: 2,
    name: "Alex Mercer",
    title: "Senior Systems Architect",
    role: "Senior Systems Architect",
    company: "AWS",
    hourlyRate: 95,
    rate: 95,
    rating: 4.9,
    totalReviews: 36,
    reviewsCount: 36,
    expertise: ["Node.js", "Python", "System Design", "DevOps"],
    bio: "Alex is a Senior Systems Architect at AWS with a focus on cloud-native backend systems, databases, and microservices architecture. With over 10 years of experience, he helps developers optimize APIs, scale databases, design robust databases, and write production-grade Node.js services.",
    image: "",
    avatarInitials: "AM",
    avatarBg: "from-purple-500 to-indigo-600",
    timezone: "PDT (UTC-7)",
    nextAvailable: "Tuesday, 10:00 AM PDT",
    isOnline: true,
    availability: [
      { dayOfWeek: 2, startTime: "10:00", endTime: "13:00" },
      { dayOfWeek: 3, startTime: "14:00", endTime: "17:00" },
      { dayOfWeek: 4, startTime: "16:00", endTime: "19:00" }
    ]
  },
  {
    id: 3,
    _id: 3,
    name: "Priya Patel",
    title: "AI Research Scientist",
    role: "AI Research Scientist",
    company: "Google",
    hourlyRate: 90,
    rate: 90,
    rating: 4.9,
    totalReviews: 52,
    reviewsCount: 52,
    expertise: ["Python", "Machine Learning", "System Design", "SQL"],
    bio: "Priya is an AI Research Scientist at Google. She specializes in machine learning pipelines, deep learning modeling, Python scripting, and SQL optimization. She helps developers understand data science frameworks, train neural networks, and deploy machine learning models to production.",
    image: "",
    avatarInitials: "PP",
    avatarBg: "from-emerald-500 to-teal-600",
    timezone: "IST (UTC+5:30)",
    nextAvailable: "Today, 3:30 PM IST",
    isOnline: false,
    availability: [
      { dayOfWeek: 1, startTime: "15:30", endTime: "18:30" },
      { dayOfWeek: 2, startTime: "10:30", endTime: "13:30" },
      { dayOfWeek: 5, startTime: "16:00", endTime: "19:00" }
    ]
  },
  {
    id: 4,
    _id: 4,
    name: "Marcus Aurelius",
    title: "Principal DevOps Engineer",
    role: "Principal DevOps Engineer",
    company: "HashiCorp",
    hourlyRate: 88,
    rate: 88,
    rating: 4.8,
    totalReviews: 24,
    reviewsCount: 24,
    expertise: ["DevOps", "System Design", "React", "Node.js"],
    bio: "Marcus is a Principal DevOps Engineer at HashiCorp. He focuses on containerization, orchestration (Kubernetes, Docker), infrastructure as code (Terraform), and CI/CD automation. He teaches cloud architecture, microservices scaling, and Go development.",
    image: "",
    avatarInitials: "MA",
    avatarBg: "from-amber-500 to-orange-600",
    timezone: "CEST (UTC+2)",
    nextAvailable: "Wednesday, 2:00 PM CEST",
    isOnline: true,
    availability: [
      { dayOfWeek: 3, startTime: "14:00", endTime: "17:00" },
      { dayOfWeek: 4, startTime: "10:00", endTime: "13:00" },
      { dayOfWeek: 5, startTime: "15:00", endTime: "18:00" }
    ]
  },
  {
    id: 5,
    _id: 5,
    name: "Elena Rostova",
    title: "Lead Product Designer",
    role: "Lead Product Designer",
    company: "Figma",
    hourlyRate: 80,
    rate: 80,
    rating: 5.0,
    totalReviews: 42,
    reviewsCount: 42,
    expertise: ["UI/UX Design", "React", "System Design", "Node.js"],
    bio: "Elena is a Lead Product Designer at Figma. She bridges the gap between design and development, specializing in design systems, component structures, interactive prototypes, and premium web styling using CSS and React. She helps engineers build beautiful, responsive, and accessible interfaces.",
    image: "",
    avatarInitials: "ER",
    avatarBg: "from-rose-500 to-pink-600",
    timezone: "GMT (UTC+0)",
    nextAvailable: "Monday, 9:00 AM GMT",
    isOnline: false,
    availability: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "12:00" },
      { dayOfWeek: 3, startTime: "13:00", endTime: "16:00" },
      { dayOfWeek: 5, startTime: "18:00", endTime: "21:00" }
    ]
  },
  {
    id: 6,
    _id: 6,
    name: "David Miller",
    title: "Mobile Engineering Lead",
    role: "Mobile Engineering Lead",
    company: "Netflix",
    hourlyRate: 90,
    rate: 90,
    rating: 4.9,
    totalReviews: 31,
    reviewsCount: 31,
    expertise: ["React Native", "UI/UX Design", "React", "Node.js"],
    bio: "David is the Mobile Engineering Lead at Netflix. He has over 7 years of experience building cross-platform iOS and Android apps with React Native, Swift, and Kotlin. He guides engineers on native bridging, app store deployments, offline-first caching, and fluid animations.",
    image: "",
    avatarInitials: "DM",
    avatarBg: "from-indigo-500 to-blue-600",
    timezone: "KST (UTC+9)",
    nextAvailable: "Friday, 10:00 AM KST",
    isOnline: true,
    availability: [
      { dayOfWeek: 4, startTime: "13:00", endTime: "16:00" },
      { dayOfWeek: 5, startTime: "10:00", endTime: "13:00" },
      { dayOfWeek: 6, startTime: "09:00", endTime: "12:00" }
    ]
  }
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
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const loadMentors = async () => {
      try {
        setLoading(true);
        const data = await fetchApi("/mentors");
        setMentors(data);
        setIsDemoMode(false);
      } catch (err) {
        if (!err.status || err.status >= 500) {
          setMentors(MOCK_MENTORS);
          setIsDemoMode(true);
          setError(null);
        } else {
          setError(err.message || "Failed to load mentors");
        }
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

  const normalisedMentors = isDemoMode ? mentors : mentors.map(normaliseMentor);

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
        
        {isDemoMode && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 flex items-center gap-3 text-sm font-semibold animate-pulse shadow-sm">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Demo Mode Active – Backend unavailable. Showing sample mentors.</span>
          </div>
        )}

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
