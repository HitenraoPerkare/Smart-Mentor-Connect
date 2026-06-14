import React from "react";

export default function BookingConfirmation({ mentor, slot, onNavigate }) {
  // Mock generated meet link
  const meetCode = Math.random().toString(36).substring(2, 5) + "-" + 
                    Math.random().toString(36).substring(2, 6) + "-" + 
                    Math.random().toString(36).substring(2, 5);
  const meetUrl = `https://meet.google.com/${meetCode}`;

  return (
    <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        
        {/* Card wrapper */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-100/80 text-center space-y-6">
          
          {/* Animated Success Checkmark */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm relative">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Booking Confirmed!</h1>
            <p className="text-xs text-slate-400 font-semibold leading-normal">
              Your mentorship session has been scheduled and synced successfully.
            </p>
          </div>

          <div className="border-t border-slate-100 my-2" />

          {/* Booking Summary details */}
          <div className="bg-slate-50 rounded-2xl p-5 text-left border border-slate-100 space-y-4">
            
            {/* Mentor */}
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mentor</div>
              <div className="flex items-center gap-2.5 mt-1">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${mentor?.avatarBg || 'from-blue-500 to-indigo-600'} text-white font-extrabold flex items-center justify-center text-xs shadow-sm`}>
                  {mentor?.avatarInitials || 'SC'}
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">{mentor?.name || 'Sarah Chen'}</h4>
                  <p className="text-[9px] text-slate-400 font-semibold">{mentor?.role || 'React Expert'}</p>
                </div>
              </div>
            </div>

            {/* Scheduled Slot */}
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date & Time</div>
              <p className="text-xs font-bold text-slate-700 mt-1">{slot || 'Tomorrow, 7:00 PM EDT'}</p>
              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md mt-1.5 inline-block">
                Timezone: {mentor?.timezone || 'EDT (UTC-4)'}
              </span>
            </div>

            {/* Calendar & Video Link info */}
            <div className="pt-2 border-t border-slate-200/60 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
                <div className="p-1 bg-emerald-100 text-emerald-600 rounded">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>Added to Google Calendar</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
                <div className="p-1 bg-blue-100 text-blue-600 rounded">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="truncate flex-1">
                  <span className="text-[10px] text-slate-400 block font-normal">Google Meet Link</span>
                  <a href={meetUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 underline truncate block">
                    {meetUrl}
                  </a>
                </div>
              </div>
            </div>

          </div>

          <p className="text-[10px] text-slate-400 leading-normal">
            A confirmation invite has been emailed to you. Please accept the calendar event to lock in the reservation.
          </p>

          {/* Action Navigation */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => onNavigate("mentors")}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-2xl shadow hover:shadow-md transition-all duration-200 text-xs cursor-pointer text-center"
            >
              Find More Mentors
            </button>
            <button
              onClick={() => onNavigate("home")}
              className="w-full py-3.5 bg-white border border-slate-200 text-slate-600 font-semibold rounded-2xl hover:bg-slate-50 transition-colors duration-200 text-xs cursor-pointer text-center"
            >
              Go to Home Page
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
