import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Mentors from "./pages/Mentors";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-grow">
        {currentPage === "home" ? (
          <Home onNavigate={setCurrentPage} />
        ) : (
          <Mentors />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;