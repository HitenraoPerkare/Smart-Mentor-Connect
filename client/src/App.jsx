import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Mentors from "./pages/Mentors";
import MentorProfile from "./pages/MentorProfile";
import Booking from "./pages/Booking";
import BecomeMentor from "./pages/BecomeMentor";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [redirectToAfterLogin, setRedirectToAfterLogin] = useState(null);

  // Global Mock Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  
  const [currentUser, setCurrentUser] = useState(() => {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  });


  // Toast notification state
  const [toast, setToast] = useState(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSelectMentor = (mentor) => {
    setSelectedMentor(mentor);
    setCurrentPage("profile");
  };

  const handleBookSession = (mentor, slot) => {
    if (!isAuthenticated) {
      setRedirectToAfterLogin({ page: "booking", mentor, slot });
      setToast({ message: "Please sign in to book a mentorship session.", type: "error" });
      setCurrentPage("login");
    } else {
      setSelectedMentor(mentor);
      setSelectedSlot(slot);
      setCurrentPage("booking");
    }
  };

  const handleBookSessionClickFromListing = (mentor) => {
    if (!isAuthenticated) {
      setRedirectToAfterLogin({ page: "profile", mentor });
      setToast({ message: "Please sign in to book a mentorship session.", type: "error" });
      setCurrentPage("login");
    } else {
      setSelectedMentor(mentor);
      setCurrentPage("profile");
    }
  };

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("role", userData.role);
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
    setToast({ message: "Successfully signed in.", type: "success" });
    
    if (redirectToAfterLogin) {
      if (redirectToAfterLogin.mentor) {
        setSelectedMentor(redirectToAfterLogin.mentor);
      }
      if (redirectToAfterLogin.slot) {
        setSelectedSlot(redirectToAfterLogin.slot);
      }
      setCurrentPage(redirectToAfterLogin.page);
      setRedirectToAfterLogin(null);
    } else {
      setCurrentPage("home");
    }
  };

  const handleRegister = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("role", userData.role);
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
    setToast({ message: "Account created successfully.", type: "success" });
    
    if (redirectToAfterLogin) {
      if (redirectToAfterLogin.mentor) {
        setSelectedMentor(redirectToAfterLogin.mentor);
      }
      if (redirectToAfterLogin.slot) {
        setSelectedSlot(redirectToAfterLogin.slot);
      }
      setCurrentPage(redirectToAfterLogin.page);
      setRedirectToAfterLogin(null);
    } else {
      setCurrentPage("home");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    setToast({ message: "Successfully signed out.", type: "success" });
    setCurrentPage("home");
  };

  const handleRoleUpdate = (updatedUserData) => {
    setCurrentUser(updatedUserData);
    localStorage.setItem("currentUser", JSON.stringify(updatedUserData));
    localStorage.setItem("role", updatedUserData.role);
    if (updatedUserData.token) {
      localStorage.setItem("token", updatedUserData.token);
    }
  };

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleRequireAuth = (targetPage) => {
    setRedirectToAfterLogin({ page: targetPage });
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900 relative">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onLogout={handleLogout}
        triggerToast={triggerToast}
      />
      <main className="flex-grow">
        {currentPage === "home" && (
          <Home onNavigate={setCurrentPage} />
        )}
        {currentPage === "mentors" && (
          <Mentors 
            isAuthenticated={isAuthenticated} 
            onSelectMentor={handleSelectMentor} 
            onBookSessionAction={handleBookSessionClickFromListing}
          />
        )}
        {currentPage === "profile" && (
          <MentorProfile
            mentor={selectedMentor}
            onBack={() => setCurrentPage("mentors")}
            onBookSession={handleBookSession}
          />
        )}
        {currentPage === "booking" && (
          <Booking
            mentor={selectedMentor}
            slot={selectedSlot}
            onNavigate={setCurrentPage}
            currentUser={currentUser}
          />
        )}
        {currentPage === "become-mentor" && (
          <BecomeMentor 
            onNavigate={setCurrentPage} 
            currentUser={currentUser}
            onRoleUpdate={handleRoleUpdate}
            triggerToast={triggerToast}
            onRequireAuth={handleRequireAuth}
          />
        )}
        {currentPage === "login" && (
          <Login onNavigate={setCurrentPage} onLogin={handleLogin} />
        )}
        {currentPage === "register" && (
          <Register onNavigate={setCurrentPage} onRegister={handleRegister} />
        )}
        {currentPage === "my-profile" && (
          <Profile currentUser={currentUser} onNavigate={setCurrentPage} />
        )}
      </main>
      <Footer />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800 transition-all duration-300 transform translate-y-0">
          {toast.type === "success" ? (
            <div className="p-1 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="p-1 bg-rose-500/10 text-rose-400 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          )}
          <span className="text-xs font-bold tracking-wide">{toast.message}</span>
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default App;