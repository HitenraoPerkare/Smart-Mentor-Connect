import { useState } from 'react';
import { fetchApi } from '../utils/api';

export default function Login({ onNavigate, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);

  // Validation errors state
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    const newErrors = { email: "", password: "" };
    let hasErrors = false;

    if (!email.trim()) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Show 'waking up' message after 4s (Render cold start)
    const wakingTimer = setTimeout(() => setIsWakingUp(true), 4000);

    try {
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password })
      });

      clearTimeout(wakingTimer);
      setIsLoading(false);
      setIsWakingUp(false);
      // Success
      setErrors(newErrors);
      onLogin({
        email: data.email,
        fullName: data.name,
        name: data.name,
        role: data.role.charAt(0).toUpperCase() + data.role.slice(1),
        token: data.token
      });
    } catch (err) {
      clearTimeout(wakingTimer);
      setIsLoading(false);
      setIsWakingUp(false);

      if (!err.status || err.status >= 500) {
        // Network/server error — fall back to local auth
        const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
        const normalizedEmail = email.trim().toLowerCase();
        const matchedUser = localUsers.find(
          (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
        );

        // Built-in demo account always available in demo mode
        const demoAccount = {
          email: "demo@smartmentor.com",
          name: "Demo User",
          role: "student"
        };
        const isDemoLogin =
          normalizedEmail === demoAccount.email && password === "demo1234";

        if (matchedUser) {
          setErrors(newErrors);
          onLogin({
            email: matchedUser.email,
            fullName: matchedUser.name,
            name: matchedUser.name,
            role: matchedUser.role.charAt(0).toUpperCase() + matchedUser.role.slice(1),
            token: `local-token-${Date.now()}`
          });
        } else if (isDemoLogin) {
          setErrors(newErrors);
          onLogin({
            email: demoAccount.email,
            fullName: demoAccount.name,
            name: demoAccount.name,
            role: "Student",
            token: `local-token-${Date.now()}`
          });
        } else {
          setErrors({ ...newErrors, email: "Server unreachable. Use demo@smartmentor.com / demo1234, or register a new local account." });
        }
      } else {
        setErrors({ ...newErrors, email: err.message || "Login failed" });
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        
        {/* Card Wrapper */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-100/80 space-y-6">
          
          {isWakingUp && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-2xl p-4 flex flex-col gap-1.5 shadow-sm">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <span className="text-xs font-bold">Waking up the server…</span>
              </div>
              <p className="text-[11px] font-medium pl-8 text-blue-600">The server is starting up (free tier). This may take up to 60 seconds. Please wait…</p>
            </div>
          )}

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
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h1>
            <p className="text-xs text-slate-400 font-semibold leading-normal">
              Enter your credentials to access your scheduler.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {/* Email Field */}
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

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Password
                </label>
                <a href="#" className="text-[10px] text-blue-600 hover:text-blue-700 font-bold transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
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

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 text-white font-bold rounded-xl shadow hover:shadow-md transition-all duration-200 text-xs cursor-pointer text-center flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    <span>{isWakingUp ? 'Waking server…' : 'Logging in…'}</span>
                  </>
                ) : (
                  'Log In'
                )}
              </button>
            </div>
          </form>

          <div className="border-t border-slate-100/60 my-2" />

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-xs text-slate-500 font-medium">
              Don't have an account?{" "}
              <button
                onClick={() => onNavigate("register")}
                className="text-blue-600 hover:text-blue-700 font-bold transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
