import React, { useState, useEffect } from "react";
import BookingConfirmation from "./BookingConfirmation";

// Fallback profile if none provided
const DEFAULT_MENTOR = {
  id: 1,
  name: "Sarah Chen",
  role: "React Expert & Tech Lead",
  company: "Stripe",
  avatarInitials: "SC",
  avatarBg: "from-blue-500 to-indigo-600",
  expertise: ["React", "Tailwind CSS", "TypeScript", "Next.js"],
  timezone: "EDT (UTC-4)",
  rating: 4.9,
  reviewsCount: 48,
  rate: 85,
  nextAvailable: "Tomorrow, 7:00 PM EDT",
  isOnline: true,
};

// Available slots by day (Mentor's local time)
const MOCK_SLOTS_BY_DAY = {
  "Monday, Jun 15": ["9:00 AM", "11:30 AM", "3:00 PM", "7:00 PM"],
  "Wednesday, Jun 17": ["10:00 AM", "1:30 PM", "5:00 PM", "8:00 PM"],
  "Friday, Jun 19": ["8:30 AM", "12:00 PM", "4:30 PM", "7:30 PM"],
};

// Timezone Offset mapping relative to UTC (in hours)
const TIMEZONE_OFFSETS = {
  "EDT (UTC-4)": -4,
  "PDT (UTC-7)": -7,
  "IST (UTC+5:30)": 5.5,
  "CEST (UTC+2)": 2,
  "GMT (UTC+0)": 0,
  "KST (UTC+9)": 9,
};

export default function Booking({ mentor = DEFAULT_MENTOR, slot: initialSlot = "", onNavigate }) {
  // Steps: 1 = Choose Slot, 2 = Review Booking, 3 = Confirmation
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState("Monday, Jun 15");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("1:1 Mentorship");
  const [duration, setDuration] = useState("60 mins");
  const [sessionNotes, setSessionNotes] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  // Populate initial slot if passed from profile
  useEffect(() => {
    if (initialSlot) {
      // E.g., "Tomorrow, 7:00 PM EDT" or "Today, 3:30 PM IST" or "Friday, 9:00 PM EDT"
      // Let's try to see if it matches any day
      const parts = initialSlot.split(", ");
      if (parts.length >= 2) {
        const dayPart = parts[0];
        const timePart = parts[1].split(" ")[0] + " " + parts[1].split(" ")[1];
        
        // Find matching day in our mock slots or create a temporary one
        const matchedDay = Object.keys(MOCK_SLOTS_BY_DAY).find(d => d.toLowerCase().includes(dayPart.toLowerCase()));
        if (matchedDay) {
          setSelectedDay(matchedDay);
          setSelectedTime(timePart);
        } else {
          // Fallback, select first slot
          setSelectedTime("7:00 PM");
        }
      } else {
        setSelectedTime("7:00 PM");
      }
    }
  }, [initialSlot]);

  // Handle selected slot string
  const getSelectedSlotString = () => {
    if (!selectedTime) return "";
    return `${selectedDay.split(",")[0]}, ${selectedTime} ${getMentorTzCode()}`;
  };

  // Extract Tz code
  const getMentorTzCode = () => {
    return mentor?.timezone ? mentor.timezone.split(" ")[0] : "EDT";
  };

  // Timezone conversion logic (EDT/PDT/etc -> IST / local)
  const getConvertedLocalTime = () => {
    if (!selectedTime) return "Select a time slot";

    // 1. Get mentor offset
    const mentorTz = mentor?.timezone || "EDT (UTC-4)";
    const mentorOffset = TIMEZONE_OFFSETS[mentorTz] !== undefined ? TIMEZONE_OFFSETS[mentorTz] : -4;
    
    // 2. Local offset (Default to +5.5 for IST as requested/typical, but check if browser has other info)
    const localOffset = 5.5; // IST
    const offsetDiff = localOffset - mentorOffset; // e.g. 5.5 - (-4) = 9.5 hours

    // 3. Parse selectedTime (e.g., "7:00 PM" or "11:30 AM")
    const timeMatch = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch) return selectedTime;

    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const ampm = timeMatch[3].toUpperCase();

    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    // Add difference
    let totalMinutes = hours * 60 + minutes + offsetDiff * 60;
    
    // Handle days overflow/underflow
    let dayOffset = 0;
    if (totalMinutes >= 24 * 60) {
      dayOffset = 1;
      totalMinutes -= 24 * 60;
    } else if (totalMinutes < 0) {
      dayOffset = -1;
      totalMinutes += 24 * 60;
    }

    let finalHours = Math.floor(totalMinutes / 60);
    const finalMinutes = Math.round(totalMinutes % 60);
    
    const finalAmpm = finalHours >= 12 ? "PM" : "AM";
    let displayHours = finalHours % 12;
    if (displayHours === 0) displayHours = 12;
    
    const displayMinutesStr = finalMinutes < 10 ? `0${finalMinutes}` : finalMinutes;
    const finalTimeStr = `${displayHours}:${displayMinutesStr} ${finalAmpm}`;

    // Adjust day name if overflowed
    const dayName = selectedDay.split(",")[0];
    let finalDayName = dayName;
    if (dayOffset === 1) {
      finalDayName = "Next Day";
    } else if (dayOffset === -1) {
      finalDayName = "Previous Day";
    }

    return `${finalTimeStr} IST`;
  };

  const activeSlotString = getSelectedSlotString();
  const convertedSlotString = getConvertedLocalTime();

  // Pricing based on duration and rate
  const getSessionPrice = () => {
    const hourlyRate = mentor?.rate || 85;
    if (duration === "30 mins") {
      return Math.round(hourlyRate * 0.5);
    }
    return hourlyRate;
  };

  const price = getSessionPrice();

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        {step < 3 && (
          <button
            onClick={() => {
              if (step === 2) {
                setStep(1);
              } else {
                onNavigate("profile");
              }
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {step === 2 ? "Back to Slot Selection" : "Back to Profile"}
          </button>
        )}

        {/* Minimal Step Indicator */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between relative">
              {/* Connector Lines */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 z-0">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
                />
              </div>

              {/* Step 1: Choose Slot */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border ${
                    step >= 1 
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20" 
                      : "bg-white border-slate-200 text-slate-400"
                  }`}
                >
                  {step > 1 ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : "1"}
                </div>
                <span className={`text-[10px] font-bold tracking-wider uppercase ${step === 1 ? "text-blue-600" : "text-slate-400"}`}>
                  Choose Slot
                </span>
              </div>

              {/* Step 2: Review Booking */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border ${
                    step >= 2 
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20" 
                      : "bg-white border-slate-200 text-slate-400"
                  }`}
                >
                  {step > 2 ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : "2"}
                </div>
                <span className={`text-[10px] font-bold tracking-wider uppercase ${step === 2 ? "text-blue-600" : "text-slate-400"}`}>
                  Review Booking
                </span>
              </div>

              {/* Step 3: Confirmation */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border ${
                    step >= 3 
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20" 
                      : "bg-white border-slate-200 text-slate-400"
                  }`}
                >
                  3
                </div>
                <span className={`text-[10px] font-bold tracking-wider uppercase ${step === 3 ? "text-blue-600" : "text-slate-400"}`}>
                  Confirmation
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Step 3 Layout: Reuses BookingConfirmation directly */}
        {step === 3 && (
          <BookingConfirmation 
            mentor={mentor} 
            slot={`${selectedDay.split(",")[0]}, ${selectedTime} ${getMentorTzCode()} (${convertedSlotString})`} 
            onNavigate={onNavigate} 
          />
        )}

        {/* Step 1 & 2 Layouts */}
        {step < 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Content Area (Columns 1 & 2) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Mentor Summary Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mentor.avatarBg || 'from-blue-500 to-indigo-600'} text-white font-extrabold flex items-center justify-center text-2xl shadow-sm`}>
                      {mentor.avatarInitials || 'MC'}
                    </div>
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${mentor.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <h2 className="text-xl font-bold text-slate-800 tracking-tight">{mentor.name}</h2>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 text-[9px] font-bold rounded uppercase">
                        {mentor.company}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{mentor.role}</p>
                    <div className="flex flex-wrap gap-1 mt-1 justify-center sm:justify-start">
                      {mentor.expertise?.slice(0, 3).map((skill) => (
                        <span key={skill} className="px-2 py-0.5 text-[10px] font-semibold bg-slate-50 text-slate-500 rounded border border-slate-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sm:text-right border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0 w-full sm:w-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Hourly Rate</p>
                      <p className="text-base font-extrabold text-blue-600">${mentor.rate}/hr</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Timezone</p>
                      <p className="text-xs font-bold text-slate-700">{mentor.timezone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 1: Choose Slot specific panels */}
              {step === 1 && (
                <>
                  {/* Timezone Conversion Panel */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Timezone Conversion</h3>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-bold">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Auto-converting offsets</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      {/* Mentor Time */}
                      <div className="md:col-span-3 text-center space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mentor's Local Time</span>
                        <div className="text-lg font-bold text-slate-800">
                          {selectedTime ? `${selectedTime} ${getMentorTzCode()}` : "--"}
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold block">{mentor.timezone}</span>
                      </div>

                      {/* Connection Indicator */}
                      <div className="md:col-span-1 flex justify-center py-2 md:py-0">
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                          <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </div>
                      </div>

                      {/* Your Local Time */}
                      <div className="md:col-span-3 text-center space-y-1">
                        <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Your Local Time</span>
                        <div className="text-lg font-extrabold text-blue-600">
                          {selectedTime ? convertedSlotString : "--"}
                        </div>
                        <span className="text-[9px] text-blue-400 font-bold block">IST (UTC+5:30)</span>
                      </div>
                    </div>
                  </div>

                  {/* Available Time Slots grouped by day */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Available Slots</h3>
                      <p className="text-xs text-slate-400 mt-1">Select a day and choose a convenient time slot.</p>
                    </div>

                    {/* Day selector tabs */}
                    <div className="flex gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
                      {Object.keys(MOCK_SLOTS_BY_DAY).map((day) => {
                        const isSelected = selectedDay === day;
                        return (
                          <button
                            key={day}
                            onClick={() => {
                              setSelectedDay(day);
                              setSelectedTime(""); // Reset time on day change
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                              isSelected
                                ? "bg-blue-600 text-white shadow shadow-blue-500/15"
                                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/50"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    {/* Slot times grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {MOCK_SLOTS_BY_DAY[selectedDay]?.map((time) => {
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-3.5 rounded-xl border text-center font-semibold text-xs transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "bg-blue-50 text-blue-600 border-blue-500 ring-2 ring-blue-500/10 shadow-sm"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* STEP 2: Review Booking form */}
              {step === 2 && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 text-left">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Booking details</h3>
                    <p className="text-xs text-slate-400 mt-1">Please provide your details and what you'd like to achieve.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Your Full Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-sm text-slate-800 rounded-xl outline-none transition-all duration-200"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Your Email Address</label>
                      <input 
                        type="email" 
                        placeholder="john.doe@example.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-sm text-slate-800 rounded-xl outline-none transition-all duration-200"
                      />
                    </div>

                    {/* Session Goals / Notes */}
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Session Goals / Questions (Optional)</label>
                      <textarea 
                        rows={4}
                        placeholder="E.g., I'd like to review my React project rendering lifecycle, discuss state management strategies, or get feedback on system design..."
                        value={sessionNotes}
                        onChange={(e) => setSessionNotes(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-sm text-slate-800 rounded-xl outline-none transition-all duration-200 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Right Booking Summary Card */}
            <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6 text-left">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md shadow-slate-100/60 space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Booking Summary</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Instant booking confirmation</p>
                </div>

                <div className="border-t border-slate-100 my-4" />

                <div className="space-y-4">
                  {/* Session Type selection (Interactive in Step 1) */}
                  <div>
                    <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">Session Type</label>
                    {step === 1 ? (
                      <select 
                        value={sessionType}
                        onChange={(e) => setSessionType(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold rounded-xl outline-none cursor-pointer"
                      >
                        <option value="1:1 Mentorship">1:1 Mentorship</option>
                        <option value="Code Review">Code Review</option>
                        <option value="Career Advice">Career Advice & Mock Interview</option>
                      </select>
                    ) : (
                      <div className="text-xs font-bold text-slate-800">{sessionType}</div>
                    )}
                  </div>

                  {/* Duration selection (Interactive in Step 1) */}
                  <div>
                    <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">Duration</label>
                    {step === 1 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {["30 mins", "60 mins"].map((d) => (
                          <button
                            key={d}
                            onClick={() => setDuration(d)}
                            className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              duration === d
                                ? "bg-blue-50 text-blue-600 border-blue-400"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-slate-800">{duration}</div>
                    )}
                  </div>

                  <div className="border-t border-slate-100/60 my-2" />

                  {/* Timezone Indicator */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Session Timezone</span>
                    <span className="font-bold text-slate-700">{getMentorTzCode()}</span>
                  </div>

                  {/* Rate Row */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Session Rate</span>
                    <span className="font-extrabold text-slate-800">${price}</span>
                  </div>

                  {/* Service fee */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Platform Service Fee</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>

                  {/* Total price */}
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100">
                    <span className="text-slate-700 font-bold">Total Price</span>
                    <span className="font-extrabold text-blue-600">${price}</span>
                  </div>

                  {/* Selection slot status */}
                  <div className="pt-2">
                    <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Selected Slot</label>
                    {selectedTime ? (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-semibold text-xs text-slate-700 space-y-1">
                        <div className="text-slate-800 font-bold">{selectedDay}</div>
                        <div className="text-blue-600 text-[11px] font-semibold">{selectedTime} {getMentorTzCode()}</div>
                        <div className="text-slate-400 text-[10px] font-medium border-t border-slate-200/50 pt-1 mt-1">
                          Local: {convertedSlotString}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-600 font-semibold">Please select an available slot</p>
                    )}
                  </div>
                </div>

                {/* Primary Action Button */}
                {step === 1 ? (
                  <button
                    disabled={!selectedTime}
                    onClick={() => setStep(2)}
                    className={`w-full py-3.5 font-bold rounded-2xl text-sm transition-all duration-200 text-center flex items-center justify-center gap-2 ${
                      selectedTime
                        ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg shadow-blue-500/15 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                        : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                    }`}
                  >
                    <span>Proceed to Review</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => setStep(3)}
                    className="w-full py-3.5 font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg shadow-blue-500/15 hover:shadow-xl hover:-translate-y-0.5 rounded-2xl text-sm transition-all duration-200 text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Confirm Booking</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
