import React, { useState } from "react";

export default function Register({ onNavigate, onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(""); // "" signifies unselected role
  const [showPassword, setShowPassword] = useState(false);

  // Validation errors state
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset errors
    const newErrors = { name: "", email: "", password: "", confirmPassword: "", role: "" };
    let hasErrors = false;

    if (!name.trim()) {
      newErrors.name = "Full Name is required";
      hasErrors = true;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      hasErrors = true;
    }

    if (!role) {
      newErrors.role = "Role must be selected";
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasErrors = true;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // Normalize email for case-insensitive lookup
    const normalizedEmail = email.trim().toLowerCase();

    // Retrieve and check for duplicate email address
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const isDuplicate = registeredUsers.some(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (isDuplicate) {
      newErrors.email = "Email is already registered.";
      setErrors(newErrors);
      return;
    }

    // Capitalize role to "Student" or "Mentor"
    const formattedRole = role === "student" ? "Student" : "Mentor";

    // Store the account details in localStorage
    const newAccount = {
      fullName: name.trim(),
      email: normalizedEmail,
      password: password,
      role: formattedRole,
      createdAt: new Date().toISOString()
    };

    registeredUsers.push(newAccount);
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    setErrors(newErrors);
    onRegister({
      email: newAccount.email,
      fullName: newAccount.fullName,
      name: newAccount.fullName,
      role: newAccount.role,
      createdAt: newAccount.createdAt
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        
        {/* Card Wrapper */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-100/80 space-y-6">
          
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="inline-block bg-blue-50 p-3 rounded-2xl text-blue-600 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Create Account</h1>
            <p className="text-xs text-slate-400 font-semibold leading-normal">
              Join Smart Mentor Connect to schedule conflict-free sessions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 bg-slate-50 border ${
                  errors.name ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-blue-500"
                } focus:bg-white text-sm text-slate-800 rounded-xl outline-none transition-all duration-200`}
              />
              {errors.name && (
                <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1.5 mt-0.5">
                  <span className="w-1 h-1 bg-rose-500 rounded-full inline-block" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Email Address
              </label>
              <input
                type="text"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 bg-slate-50 border ${
                  errors.email ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-blue-500"
                } focus:bg-white text-sm text-slate-800 rounded-xl outline-none transition-all duration-200`}
              />
              {errors.email && (
                <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1.5 mt-0.5">
                  <span className="w-1 h-1 bg-rose-500 rounded-full inline-block" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Role Selection (Student vs Mentor Cards) */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Student Option */}
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`p-4 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    role === "student"
                      ? "bg-blue-50 text-blue-600 border-blue-500 ring-2 ring-blue-500/10 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Student</span>
                </button>

                {/* Mentor Option */}
                <button
                  type="button"
                  onClick={() => setRole("mentor")}
                  className={`p-4 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    role === "mentor"
                      ? "bg-blue-50 text-blue-600 border-blue-500 ring-2 ring-blue-500/10 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Mentor</span>
                </button>
              </div>
              {errors.role && (
                <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1.5 mt-0.5">
                  <span className="w-1 h-1 bg-rose-500 rounded-full inline-block" />
                  {errors.role}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-4 pr-11 py-3 bg-slate-50 border ${
                    errors.password ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-blue-500"
                  } focus:bg-white text-sm text-slate-800 rounded-xl outline-none transition-all duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1.5 mt-0.5">
                  <span className="w-1 h-1 bg-rose-500 rounded-full inline-block" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-type password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 bg-slate-50 border ${
                  errors.confirmPassword ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-blue-500"
                } focus:bg-white text-sm text-slate-800 rounded-xl outline-none transition-all duration-200`}
              />
              {errors.confirmPassword && (
                <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1.5 mt-0.5">
                  <span className="w-1 h-1 bg-rose-500 rounded-full inline-block" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow hover:shadow-md transition-all duration-200 text-xs cursor-pointer text-center"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="border-t border-slate-100/60 my-2" />

          {/* Login Link */}
          <div className="text-center">
            <p className="text-xs text-slate-500 font-medium">
              Already have an account?{" "}
              <button
                onClick={() => onNavigate("login")}
                className="text-blue-600 hover:text-blue-700 font-bold transition-colors cursor-pointer"
              >
                Login
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
