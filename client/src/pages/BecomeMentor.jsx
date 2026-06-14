import React from "react";

export default function BecomeMentor({ onNavigate }) {
  return (
    <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-xl w-full px-6">
        
        {/* Card wrapper */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-100/80 text-center space-y-6">
          
          {/* Animated/Glowing Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm relative">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500"></span>
              </span>
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Become a Mentor</h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              Share your tech expertise, guide the next generation of builders, and set your own rates while meeting developers worldwide.
            </p>
          </div>

          {/* Status Message Panel */}
          <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl max-w-md mx-auto space-y-1">
            <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-blue-700 uppercase tracking-wider">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Onboarding Status</span>
            </div>
            <p className="text-xs text-blue-600 font-semibold">
              Mentor onboarding coming soon
            </p>
            <p className="text-[10px] text-slate-400 font-medium pt-1 border-t border-blue-100/50 mt-1 max-w-xs mx-auto">
              We are currently in a closed beta with invited mentors. Join our waiting list to get notified when applications open.
            </p>
          </div>

          <div className="border-t border-slate-100 my-4" />

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => onNavigate("home")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-2xl shadow hover:shadow-md transition-all duration-200 text-xs cursor-pointer text-center"
            >
              Back to Home
            </button>
            <button
              disabled
              className="px-6 py-3 bg-slate-100 text-slate-400 border border-slate-200 font-semibold rounded-2xl text-xs cursor-not-allowed text-center"
            >
              Join Waiting List (Soon)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
