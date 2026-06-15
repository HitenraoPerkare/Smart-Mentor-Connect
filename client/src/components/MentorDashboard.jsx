import { useState, useEffect } from "react";
import { fetchApi } from "../utils/api";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function MentorDashboard({ currentUser, onNavigate }) {
  const [activeTab, setActiveTab] = useState("sessions"); // "sessions" or "availability"
  const [bookings, setBookings] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [bookingsData, profileData] = await Promise.all([
          fetchApi("/bookings/my-bookings"),
          fetchApi("/mentors/me"),
        ]);
        setBookings(bookingsData);
        setAvailability(profileData.availability || []);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

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

  const handleSaveAvailability = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg("");
    try {
      await fetchApi("/mentors/profile", {
        method: "PUT",
        body: JSON.stringify({ availability }),
      });
      setSuccessMsg("Availability updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to save availability.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("sessions")}
            className={`font-bold text-sm pb-4 -mb-4 border-b-2 transition-colors ${
              activeTab === "sessions" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Upcoming Sessions
          </button>
          <button
            onClick={() => setActiveTab("availability")}
            className={`font-bold text-sm pb-4 -mb-4 border-b-2 transition-colors ${
              activeTab === "availability" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Manage Availability
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 text-rose-600 text-sm font-semibold rounded-xl border border-rose-100">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-xl border border-emerald-100">
          {successMsg}
        </div>
      )}

      {activeTab === "sessions" && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-slate-500 text-sm font-medium">No upcoming sessions booked yet.</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking._id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                    {new Date(booking.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Session with {booking.studentId?._id === currentUser._id ? booking.mentorId?.userId?.name || "Mentor" : booking.studentId?.name || "Student"}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    {booking.startTime} - {booking.endTime} ({currentUser.timezone})
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                    booking.status === "cancelled" ? "bg-rose-100 text-rose-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {booking.status}
                  </span>
                  {booking.meetingLink && (
                    <a href={booking.meetingLink} target="_blank" rel="noreferrer" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm">
                      Join Meet
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "availability" && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Weekly Availability</h3>
            <p className="text-xs text-slate-500">Update your recurring slots. Changes will apply to future bookings.</p>
            
            <div className="space-y-3 pt-2">
              {availability.map((slot, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl relative group shadow-sm">
                  <select
                    value={slot.dayOfWeek}
                    onChange={(e) => updateAvailabilitySlot(index, 'dayOfWeek', Number(e.target.value))}
                    className="w-full sm:w-1/3 px-3 py-2 bg-slate-50 border border-slate-200 text-sm rounded-xl outline-none focus:border-blue-500 font-medium"
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
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 text-sm rounded-xl outline-none focus:border-blue-500 font-medium"
                    />
                    <span className="text-slate-400 font-medium text-xs">to</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateAvailabilitySlot(index, 'endTime', e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 text-sm rounded-xl outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <button
                    onClick={() => removeAvailabilitySlot(index)}
                    className="absolute -top-2 -right-2 sm:static sm:top-auto sm:right-auto w-6 h-6 sm:w-8 sm:h-8 bg-white sm:bg-rose-50 border border-slate-200 sm:border-rose-100 rounded-full flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-rose-100 transition-colors shadow-sm"
                    title="Remove slot"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
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
            
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={handleSaveAvailability}
                disabled={saving || availability.length === 0}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-md transition-all duration-200 flex items-center gap-2"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
