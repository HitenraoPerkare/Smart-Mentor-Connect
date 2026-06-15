import { useState } from "react";
import { fetchApi } from "../utils/api";

const PREDEFINED_EXPERTISE = [
  "React", "Node.js", "Python", "UI/UX Design", "System Design",
  "DevOps", "React Native", "TypeScript", "AWS", "Machine Learning"
];

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function BecomeMentor({ onNavigate, currentUser, onRoleUpdate, triggerToast, onRequireAuth }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState([]);
  const [availability, setAvailability] = useState([{ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }]);

  if (!currentUser) {
    return (
      <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center space-y-5 max-w-sm w-full">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Sign in to Continue</h2>
          <p className="text-sm text-slate-500">You need an account to become a mentor and set up your profile.</p>
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => {
                if (onRequireAuth) onRequireAuth("become-mentor");
                onNavigate("register");
              }}
              className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-blue-700 transition cursor-pointer"
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                if (onRequireAuth) onRequireAuth("become-mentor");
                onNavigate("login");
              }}
              className="w-full py-3 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl shadow-sm hover:bg-slate-200 transition cursor-pointer"
            >
              Log in to Existing Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentUser.role === "mentor") {
    return (
      <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">You're already a mentor!</h2>
          <p className="text-sm text-slate-500">You can manage your profile from your dashboard.</p>
          <button
            onClick={() => onNavigate("my-profile")}
            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition"
          >
            Go to My Profile
          </button>
        </div>
      </div>
    );
  }

  const toggleExpertise = (skill) => {
    if (expertise.includes(skill)) {
      setExpertise(expertise.filter((s) => s !== skill));
    } else {
      setExpertise([...expertise, skill]);
    }
  };

  const addAvailabilitySlot = () => {
    setAvailability([...availability, { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }]);
  };

  const updateAvailabilitySlot = (index, field, value) => {
    const newAvailability = [...availability];
    newAvailability[index][field] = value;
    setAvailability(newAvailability);
  };

  const removeAvailabilitySlot = (index) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!bio.trim() || expertise.length === 0 || availability.length === 0) {
      setError("Please fill out all sections before submitting.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updatedUser = await fetchApi("/mentors/onboard", {
        method: "POST",
        body: JSON.stringify({ bio, expertise, availability }),
      });

      triggerToast("Welcome aboard! You are now a mentor.", "success");
      onRoleUpdate(updatedUser); // Update local token and role
      onNavigate("my-profile"); // Redirect
    } catch (err) {
      if (!err.status || err.status >= 500) {
        const updatedUser = {
          ...currentUser,
          role: "mentor",
          bio,
          expertise,
          availability
        };
        const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
        const idx = localUsers.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
        if (idx !== -1) {
          localUsers[idx] = {
            ...localUsers[idx],
            role: "mentor",
            bio,
            expertise,
            availability
          };
          localStorage.setItem("localUsers", JSON.stringify(localUsers));
        }
        triggerToast("Welcome aboard! You are now a mentor (Demo Mode).", "success");
        onRoleUpdate(updatedUser);
        onNavigate("my-profile");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-10 flex items-center justify-center">
      <div className="max-w-2xl w-full px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Become a Mentor</h1>
          <p className="text-sm text-slate-500">Share your knowledge and help others grow.</p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100/50">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between relative mb-8">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 z-0 rounded-full">
              <div 
                className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                style={{ width: step === 1 ? "15%" : step === 2 ? "50%" : "100%" }}
              />
            </div>
            
            {[1, 2, 3].map((num) => (
              <div key={num} className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 ${
                    step >= num 
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20" 
                      : "bg-white border-slate-200 text-slate-400"
                  }`}
                >
                  {step > num ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : num}
                </div>
                <span className={`text-[10px] font-bold tracking-wider uppercase absolute top-10 whitespace-nowrap ${step === num ? "text-blue-600" : "text-slate-400"}`}>
                  {num === 1 ? "About You" : num === 2 ? "Expertise" : "Availability"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-14 border-t border-slate-100 pt-8">
            {error && (
              <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-sm font-semibold rounded-xl border border-rose-100 flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Step 1: Bio */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-lg font-bold text-slate-800">Tell us about yourself</h3>
                <p className="text-xs text-slate-500">Write a short bio that will appear on your public mentor profile.</p>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="E.g., I am a Senior Frontend Engineer with 5 years of experience..."
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-sm text-slate-800 rounded-xl outline-none transition-all duration-200 resize-none"
                />
              </div>
            )}

            {/* Step 2: Expertise */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-lg font-bold text-slate-800">What are your areas of expertise?</h3>
                <p className="text-xs text-slate-500">Select the topics you can help students with.</p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {PREDEFINED_EXPERTISE.map((skill) => {
                    const isSelected = expertise.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => toggleExpertise(skill)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                          isSelected 
                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20" 
                            : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Availability */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-lg font-bold text-slate-800">When are you available?</h3>
                <p className="text-xs text-slate-500">Add your weekly recurring availability slots (in your local timezone).</p>

                <div className="space-y-3">
                  {availability.map((slot, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl relative group">
                      <select
                        value={slot.dayOfWeek}
                        onChange={(e) => updateAvailabilitySlot(index, 'dayOfWeek', Number(e.target.value))}
                        className="w-full sm:w-1/3 px-3 py-2 bg-white border border-slate-200 text-sm rounded-xl outline-none focus:border-blue-500"
                      >
                        {DAYS_OF_WEEK.map((day, idx) => (
                          <option key={day} value={idx}>{day}</option>
                        ))}
                      </select>

                      <div className="flex items-center gap-2 w-full sm:w-2/3">
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateAvailabilitySlot(index, 'startTime', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 text-sm rounded-xl outline-none focus:border-blue-500"
                        />
                        <span className="text-slate-400 font-medium text-xs">to</span>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateAvailabilitySlot(index, 'endTime', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 text-sm rounded-xl outline-none focus:border-blue-500"
                        />
                      </div>

                      {availability.length > 1 && (
                        <button
                          onClick={() => removeAvailabilitySlot(index)}
                          className="absolute -top-2 -right-2 sm:static sm:top-auto sm:right-auto w-6 h-6 sm:w-auto sm:h-auto bg-white sm:bg-transparent border sm:border-none border-slate-200 rounded-full flex items-center justify-center text-rose-500 hover:text-rose-600 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={addAvailabilitySlot}
                    className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 py-2 px-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add another slot
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : onNavigate("home")}
              className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 ? !bio.trim() : expertise.length === 0}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-md transition-all duration-200 cursor-pointer"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || availability.length === 0}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
