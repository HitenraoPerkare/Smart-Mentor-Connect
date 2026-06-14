import React, { useState } from "react";

const MENTOR_PROFILES_DETAILS = {
  1: {
    bio: "Sarah is a frontend specialist and Tech Lead at Stripe with over 8 years of experience building scalable web applications. She is passionate about modern React, state management, design systems, and frontend performance optimization. She loves helping engineers transition from juniors to seniors by breaking down complex rendering and architectural patterns.",
    experience: {
      years: "8+ Years",
      companies: "Stripe, Netflix, Airbnb",
      sessions: "240+ Sessions",
    },
    slots: ["Today, 7:00 PM EDT", "Tomorrow, 5:00 PM EDT", "Friday, 9:00 PM EDT"],
    reviews: [
      {
        id: 101,
        studentName: "John Doe",
        role: "Frontend Engineer",
        rating: 5,
        date: "June 10, 2026",
        comment: "Amazing mentor! Helped me debug a tricky memory leak in React and explained rendering lifecycles clearly. 10/10.",
      },
      {
        id: 102,
        studentName: "Jane Smith",
        role: "Software Engineer",
        rating: 5,
        date: "June 03, 2026",
        comment: "Sarah's system architecture insights are next-level. She broke down design systems and event states in a way that just made sense.",
      },
      {
        id: 103,
        studentName: "Michael Chang",
        role: "Bootcamp Graduate",
        rating: 4,
        date: "May 28, 2026",
        comment: "Very patient and articulate. Highly recommend for anyone wanting to level up their modern React skills.",
      },
    ],
  },
  2: {
    bio: "Alex is a Senior Systems Architect at AWS with a focus on cloud-native backend systems, databases, and microservices architecture. With over 10 years of experience, he helps developers optimize APIs, scale databases, design robust databases, and write production-grade Node.js services.",
    experience: {
      years: "10+ Years",
      companies: "AWS, Microsoft, Uber",
      sessions: "180+ Sessions",
    },
    slots: ["Tuesday, 10:00 AM PDT", "Wednesday, 2:00 PM PDT", "Thursday, 4:00 PM PDT"],
    reviews: [
      {
        id: 201,
        studentName: "Robert Vance",
        role: "Backend Dev",
        rating: 5,
        date: "June 12, 2026",
        comment: "Alex is incredibly knowledgeable. He helped me restructure our database indexes and cut our query times in half.",
      },
      {
        id: 202,
        studentName: "Emily Watson",
        role: "Junior Dev",
        rating: 5,
        date: "June 05, 2026",
        comment: "Clear, structured, and very professional. He gave me a detailed roadmap for learning distributed systems architecture.",
      },
      {
        id: 203,
        studentName: "Arjun Mehta",
        role: "Tech Lead",
        rating: 4,
        date: "May 20, 2026",
        comment: "Deep technical dive on AWS serverless scaling. Extremely valuable session.",
      },
    ],
  },
  3: {
    bio: "Priya is an AI Research Scientist at Google. She specializes in machine learning pipelines, deep learning modeling, Python scripting, and SQL optimization. She helps developers understand data science frameworks, train neural networks, and deploy machine learning models to production.",
    experience: {
      years: "6+ Years",
      companies: "Google, DeepMind, Intel",
      sessions: "310+ Sessions",
    },
    slots: ["Today, 3:30 PM IST", "Tomorrow, 10:30 AM IST", "Friday, 4:00 PM IST"],
    reviews: [
      {
        id: 301,
        studentName: "Siddharth Sen",
        role: "Data Analyst",
        rating: 5,
        date: "June 11, 2026",
        comment: "Priya helped me clarify complex backpropagation concepts. Excellent explanations!",
      },
      {
        id: 302,
        studentName: "Lucia Santos",
        role: "ML Engineer",
        rating: 5,
        date: "June 04, 2026",
        comment: "Perfect session for optimizing PyTorch models. She knows the details of hardware acceleration very well.",
      },
      {
        id: 303,
        studentName: "Kenji Sato",
        role: "Python Engineer",
        rating: 5,
        date: "May 25, 2026",
        comment: "A highly practical approach to structuring ML datasets. I will definitely book another session.",
      },
    ],
  },
  4: {
    bio: "Marcus is a Principal DevOps Engineer at HashiCorp. He focuses on containerization, orchestration (Kubernetes, Docker), infrastructure as code (Terraform), and CI/CD automation. He teaches cloud architecture, microservices scaling, and Go development.",
    experience: {
      years: "9+ Years",
      companies: "HashiCorp, Red Hat, DigitalOcean",
      sessions: "120+ Sessions",
    },
    slots: ["Wednesday, 2:00 PM CEST", "Thursday, 10:00 AM CEST", "Friday, 3:00 PM CEST"],
    reviews: [
      {
        id: 401,
        studentName: "Pierre Dubois",
        role: "Cloud Specialist",
        rating: 5,
        date: "June 08, 2026",
        comment: "Outstanding mentor. We resolved a persistent network policy error in our Kubernetes cluster in 20 minutes.",
      },
      {
        id: 402,
        studentName: "Chloe Fraser",
        role: "Systems Administrator",
        rating: 4,
        date: "May 30, 2026",
        comment: "Marcus provided great tips on modularizing our Terraform configurations. Very helpful.",
      },
      {
        id: 403,
        studentName: "Devon Cole",
        role: "Fullstack Dev",
        rating: 5,
        date: "May 18, 2026",
        comment: "A master of CI/CD concepts. Great advice on pipeline security.",
      },
    ],
  },
  5: {
    bio: "Elena is a Lead Product Designer at Figma. She bridges the gap between design and development, specializing in design systems, component structures, interactive prototypes, and premium web styling using CSS and React. She helps engineers build beautiful, responsive, and accessible interfaces.",
    experience: {
      years: "7+ Years",
      companies: "Figma, Adobe, Spotify",
      sessions: "420+ Sessions",
    },
    slots: ["Monday, 9:00 AM GMT", "Wednesday, 1:00 PM GMT", "Friday, 6:00 PM GMT"],
    reviews: [
      {
        id: 501,
        studentName: "Avery Jenkins",
        role: "Frontend Engineer",
        rating: 5,
        date: "June 09, 2026",
        comment: "Elena's advice on accessibility (WCAG) and design tokens was game-changing for our team's project.",
      },
      {
        id: 502,
        studentName: "Mateo Rodriguez",
        role: "Product Manager",
        rating: 5,
        date: "June 02, 2026",
        comment: "Incredibly insight on layout mapping. Elena understands how to coordinate designers and devs effectively.",
      },
      {
        id: 503,
        studentName: "Yuki Tanaka",
        role: "UX Researcher",
        rating: 5,
        date: "May 22, 2026",
        comment: "Detailed review of my Figma prototype. Very constructive feedback on usability.",
      },
    ],
  },
  6: {
    bio: "David is the Mobile Engineering Lead at Netflix. He has over 7 years of experience building cross-platform iOS and Android apps with React Native, Swift, and Kotlin. He guides engineers on native bridging, app store deployments, offline-first caching, and fluid animations.",
    experience: {
      years: "7+ Years",
      companies: "Netflix, Meta, Slack",
      sessions: "150+ Sessions",
    },
    slots: ["Thursday, 1:00 PM KST", "Friday, 10:00 AM KST", "Saturday, 9:00 AM KST"],
    reviews: [
      {
        id: 601,
        studentName: "Nathan Drake",
        role: "iOS Developer",
        rating: 5,
        date: "June 13, 2026",
        comment: "Highly specialized guidance on Native Modules in React Native. Resolved my performance issue instantly.",
      },
      {
        id: 602,
        studentName: "Lisa Kudrow",
        role: "Mobile App Creator",
        rating: 5,
        date: "June 06, 2026",
        comment: "David's app store release advice saved us from rejection. Super helpful and patient.",
      },
      {
        id: 603,
        studentName: "Tariq Ali",
        role: "Junior Mobile Dev",
        rating: 4,
        date: "May 27, 2026",
        comment: "Excellent support for understanding React Native navigation architectures.",
      },
    ],
  },
};

// Fallback profile if none provided
const DEFAULT_MENTOR = {
  id: 1,
  name: "Sarah Chen",
  role: "React Expert & Tech Lead",
  company: "Stripe",
  avatarInitials: "SC",
  avatarBg: "from-blue-500 to-indigo-600",
  expertise: ["React", "Tailwind CSS", "TypeScript", "Next.js", "System Design"],
  timezone: "EDT (UTC-4)",
  rating: 4.9,
  reviewsCount: 48,
  rate: 85,
  nextAvailable: "Tomorrow, 7:00 PM EDT",
  isOnline: true,
};

export default function MentorProfile({ mentor = DEFAULT_MENTOR, onBack, onBookSession }) {
  const details = MENTOR_PROFILES_DETAILS[mentor.id] || MENTOR_PROFILES_DETAILS[1];
  const [selectedSlot, setSelectedSlot] = useState("");

  const handleBookClick = () => {
    if (selectedSlot) {
      onBookSession(mentor, selectedSlot);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Mentors
        </button>

        {/* Mentor Header Block */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 text-center md:text-left">
            <div className="relative">
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${mentor.avatarBg} text-white font-extrabold flex items-center justify-center text-3xl shadow-md`}>
                {mentor.avatarInitials}
              </div>
              <span className={`absolute -bottom-1 -right-1 w-5 h-5 border-4 border-white rounded-full ${mentor.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">{mentor.name}</h1>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold rounded-lg uppercase">
                  {mentor.company}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">{mentor.role}</p>
              
              {/* Rating block */}
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-sm font-bold text-slate-700">
                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{mentor.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400 font-normal">({mentor.reviewsCount} student reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-6 text-center md:text-right border-t md:border-t-0 border-slate-100 pt-5 md:pt-0 w-full md:w-auto justify-around md:justify-start">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hourly Rate</p>
              <p className="text-xl font-extrabold text-blue-600">${mentor.rate}/hr</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Timezone</p>
              <p className="text-sm font-bold text-slate-700">{mentor.timezone}</p>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Info Columns (Left - 2/3 Width) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Biography */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 text-left">
              <h2 className="text-lg font-bold text-slate-800">About Me</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {details.bio}
              </p>
            </div>

            {/* Skills */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 text-left">
              <h2 className="text-lg font-bold text-slate-800">Expertise & Skills</h2>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 rounded-xl"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience Stats */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-5 text-left">
              <h2 className="text-lg font-bold text-slate-800">Professional Background</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Experience</p>
                  <p className="text-lg font-bold text-slate-800 mt-1">{details.experience.years}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Featured Companies</p>
                  <p className="text-sm font-bold text-slate-800 mt-1 truncate" title={details.experience.companies}>
                    {details.experience.companies}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed Sessions</p>
                  <p className="text-lg font-bold text-slate-800 mt-1">{details.experience.sessions}</p>
                </div>
              </div>
            </div>

            {/* Availability Slots selection */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 text-left">
              <h2 className="text-lg font-bold text-slate-800">Select an Available Slot</h2>
              <p className="text-xs text-slate-400 leading-normal">
                Slots are converted and displayed in the mentor's timezone. Select a slot to enable booking.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {details.slots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-4 rounded-2xl border text-center font-semibold text-xs transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/15"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="uppercase text-[9px] font-bold text-slate-400 tracking-wider mb-1 group-hover:text-blue-200">
                        {slot.split(",")[0]}
                      </div>
                      <div className={isSelected ? "text-white font-extrabold" : "text-slate-800 font-bold"}>
                        {slot.split(",")[1]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 text-left">
              <h2 className="text-lg font-bold text-slate-800">Recent Student Feedback</h2>
              <div className="space-y-4">
                {details.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-700 text-sm">{rev.studentName}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">{rev.role}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                    </div>
                    {/* Stars */}
                    <div className="flex gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sticky Sidebar Booking Card (Right - 1/3 Width) */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md shadow-slate-100/60 space-y-5 text-left">
              <div>
                <h3 className="text-base font-bold text-slate-800">Booking Summary</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Instant booking confirmation</p>
              </div>

              <div className="border-t border-slate-100 my-4" />

              <div className="space-y-4">
                {/* Rate Row */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Hourly Session Rate</span>
                  <span className="font-extrabold text-slate-800">${mentor.rate}/hr</span>
                </div>

                {/* Service fee */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Booking Platform Fee</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>

                {/* Timezone alignment warning */}
                <div className="p-3 bg-blue-50/50 border border-blue-100/60 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-blue-700 font-bold">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Timezone Detected</span>
                  </div>
                  <p className="text-[10px] text-blue-600 leading-relaxed font-medium">
                    Google Calendar conflicts will be verified automatically in real-time.
                  </p>
                </div>

                {/* Selection status */}
                <div className="pt-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Selected Slot</p>
                  {selectedSlot ? (
                    <div className="mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100 font-semibold text-xs text-slate-700 flex justify-between items-center">
                      <span>{selectedSlot}</span>
                      <button 
                        onClick={() => setSelectedSlot("")}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-amber-600 font-semibold mt-1">Please select an available slot below</p>
                  )}
                </div>
              </div>

              {/* Book Button */}
              <button
                disabled={!selectedSlot}
                onClick={handleBookClick}
                className={`w-full py-3.5 font-bold rounded-2xl text-sm transition-all duration-200 text-center flex items-center justify-center gap-2 ${
                  selectedSlot
                    ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg shadow-blue-500/15 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5 cursor-pointer"
                    : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                }`}
              >
                <span>Book Session Now</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
