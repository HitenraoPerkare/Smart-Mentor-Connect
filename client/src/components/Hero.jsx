
export default function Hero({ onNavigate }) {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-24 lg:pb-28">
      {/* Decorative background blob */}
      <div className="absolute top-1/4 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100/40 to-indigo-100/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 -translate-x-1/3 w-[300px] h-[300px] bg-gradient-to-br from-blue-50/50 to-slate-50/50 rounded-full blur-2xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Content Column */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              Real-time Global Connect
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Book Tech Mentorship <br className="hidden sm:inline" />
              <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Across Time Zones
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Find global experts and schedule sessions effortlessly. Smart Mentor Connect automatically translates time zones, syncs with your Google Calendar, and schedules conflict-free.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate("mentors")}
                className="px-7 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/15 hover:shadow-xl hover:shadow-blue-600/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-center"
              >
                Find a Mentor
              </button>
              <button 
                onClick={() => onNavigate("become-mentor")}
                className="px-7 py-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-all duration-200 cursor-pointer text-center"
              >
                Become a Mentor
              </button>
            </div>

            {/* Micro-Social Proof */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Learn from industry professionals at
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-slate-500">
                <span className="hover:text-slate-700 transition-colors">Google</span>
                <span className="hover:text-slate-700 transition-colors">Stripe</span>
                <span className="hover:text-slate-700 transition-colors">Meta</span>
                <span className="hover:text-slate-700 transition-colors">Netflix</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Column (Booking Card) */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Main Interactive Booking Preview Card */}
            <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/80 p-6 md:p-8 space-y-6 relative hover:shadow-2xl hover:shadow-slate-100 transition-shadow duration-300">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {/* Initial Badge styled like a premium profile */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-base shadow-sm">
                      SC
                    </div>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">Sarah Chen</h3>
                    <p className="text-xs text-slate-500 font-medium">React Expert & Tech Lead</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100 flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Available Now
                </span>
              </div>

              {/* Time Zone Match Demonstration */}
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Scheduling Translation
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {/* Mentor Time */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-200/50 rounded-lg text-slate-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-medium">Mentor Time (EDT)</div>
                        <div className="text-sm font-bold text-slate-700">7:00 PM EDT</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-md">UTC -4</span>
                  </div>

                  {/* Visual Connection Arrow */}
                  <div className="flex justify-center -my-1.5 relative z-10">
                    <div className="bg-blue-600 text-white rounded-full p-1.5 shadow-md shadow-blue-500/20 border border-white">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* User Local Time */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/50 border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-blue-500 font-bold">Your Local Time (IST)</div>
                        <div className="text-sm font-bold text-blue-700">4:30 AM IST</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-100/50 px-2 py-0.5 rounded-md">UTC +5:30</span>
                  </div>
                </div>
              </div>

              {/* Status Details */}
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium p-3 bg-slate-50 rounded-xl">
                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Google Calendar conflict checking passed</span>
              </div>

              {/* Booking Button */}
              <button 
                onClick={() => onNavigate("mentors")}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>Confirm Booking</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

            </div>

            {/* Decorative secondary widget floating behind */}
            <div className="absolute -bottom-6 -left-6 w-44 bg-white border border-slate-100 rounded-2xl shadow-lg p-3 hidden sm:flex items-center gap-3 -z-10 animate-pulse">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Calendar Synced</p>
                <p className="text-xs font-bold text-slate-700">Google Meet URL</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
