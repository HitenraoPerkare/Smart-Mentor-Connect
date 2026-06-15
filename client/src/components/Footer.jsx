
export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 pb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-bold text-slate-800 text-base tracking-tight">
                Smart Mentor <span className="text-blue-600">Connect</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Empowering developers worldwide to schedule, sync, and learn from top tech industry mentors without timezone conversion friction.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 text-slate-400">
              <a href="#" className="hover:text-blue-600 transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block"></div>

          {/* Links Column 1: Product */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Product</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                  Find Mentors
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                  Become a Mentor
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Resources */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Resources</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                  Blog Updates
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                  Guides & Playbooks
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                  Timezone Tools
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Company & Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                  Security Info
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                  Cookie Settings
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Smart Mentor Connect. All rights reserved.
          </p>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-xs font-semibold text-slate-500">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
            Hackathon Project Edition
          </div>
        </div>

      </div>
    </footer>
  );
}
