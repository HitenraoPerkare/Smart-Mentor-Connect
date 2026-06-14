import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Mentors from "./pages/Mentors";
import MentorProfile from "./pages/MentorProfile";
import BookingConfirmation from "./pages/BookingConfirmation";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");

  const handleSelectMentor = (mentor) => {
    setSelectedMentor(mentor);
    setCurrentPage("profile");
  };

  const handleBookSession = (mentor, slot) => {
    setSelectedMentor(mentor);
    setSelectedSlot(slot);
    setCurrentPage("booking");
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-grow">
        {currentPage === "home" && (
          <Home onNavigate={setCurrentPage} />
        )}
        {currentPage === "mentors" && (
          <Mentors onSelectMentor={handleSelectMentor} />
        )}
        {currentPage === "profile" && (
          <MentorProfile
            mentor={selectedMentor}
            onBack={() => setCurrentPage("mentors")}
            onBookSession={handleBookSession}
          />
        )}
        {currentPage === "booking" && (
          <BookingConfirmation
            mentor={selectedMentor}
            slot={selectedSlot}
            onNavigate={setCurrentPage}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;