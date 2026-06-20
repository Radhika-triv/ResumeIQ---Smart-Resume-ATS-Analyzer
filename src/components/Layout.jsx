import React, { useState } from 'react';
import { Cpu, Settings, Moon, Compass, Menu, X, ArrowUpRight, Mail } from 'lucide-react';

/**
 * Premium Layout wrapper containing a responsive navbar, decorative background effects,
 * main dashboard layout, and customized footer.
 */
export default function Layout({ children, currentView = 'analyzer', setCurrentView, customEmail }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { id: 'analyzer', label: 'Analyzer' },
    { id: 'tailor', label: 'Tailor Tool' },
    { id: 'guidelines', label: 'ATS Guidelines' }
  ];

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-brand-indigo/35 selection:text-white">
      {/* Decorative background ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Blob 1 */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-brand-blue/20 to-brand-indigo/10 blur-[120px] rounded-full animate-float" />
        {/* Blob 2 */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tr from-brand-purple/15 to-brand-blue/10 blur-[150px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />
        {/* Fine grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <div 
              className="flex items-center gap-2.5 group cursor-pointer"
              onClick={() => setCurrentView('analyzer')}
            >
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-indigo text-white shadow-lg shadow-brand-indigo/20 group-hover:scale-105 transition-transform duration-300">
                <Cpu size={22} className="animate-pulse" />
              </div>
              <div>
                <span className="font-heading font-bold text-xl tracking-tight text-white group-hover:text-brand-blue transition-colors">
                  Resume<span className="gradient-text">IQ</span>
                </span>
                <span className="block text-[10px] text-gray-400 font-semibold tracking-wider uppercase -mt-0.5">
                  Smart ATS Resume Analyzer
                </span>
              </div>
            </div>

            {/* Navigation Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setCurrentView(link.id)}
                  className={`text-sm font-medium px-1 py-1 transition-all cursor-pointer ${
                    currentView === link.id
                      ? 'text-white border-b-2 border-brand-indigo'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Action Group & Hamburger Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('guidelines')}
                className={`hidden sm:inline-flex p-2 rounded-xl border transition-all cursor-pointer ${
                  currentView === 'guidelines'
                    ? 'text-white bg-white/10 border-white/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent hover:border-white/10'
                }`}
                title="Explore guidelines"
                aria-label="Explore guidelines"
              >
                <Compass size={20} />
              </button>
              <button
                onClick={() => setCurrentView('settings')}
                className={`hidden sm:inline-flex p-2 rounded-xl border transition-all cursor-pointer ${
                  currentView === 'settings'
                    ? 'text-white bg-white/10 border-white/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent hover:border-white/10'
                }`}
                title="Settings"
                aria-label="Settings"
              >
                <Settings size={20} />
              </button>
              <div className="hidden sm:block h-5 w-[1px] bg-white/10" />
              <div className="p-2.5 rounded-xl bg-white/5 text-brand-indigo border border-white/5 flex items-center gap-2 text-xs font-semibold select-none">
                <span className="inline-block w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
                V1.0.0
              </div>

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 transition-all cursor-pointer"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-dark-950/95 backdrop-blur-2xl animate-fade-in-up">
            <div className="px-2 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentView(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left block px-3 py-2.5 rounded-xl text-base font-medium transition-colors cursor-pointer ${
                    currentView === link.id
                      ? 'bg-brand-indigo/10 text-white font-semibold border-l-4 border-brand-indigo'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <div className="flex gap-4 px-3 pt-3 border-t border-white/5 mt-3">
                <button
                  onClick={() => {
                    setCurrentView('guidelines');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer"
                  title="Explore"
                >
                  <Compass size={18} />
                  <span>Explore Guidelines</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('settings');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer"
                  title="Settings"
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="animate-fade-in-up">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 glass-panel py-8 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1.5">
            <h4 className="text-sm font-bold text-white tracking-wide">Radhika Trivedi</h4>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <Mail size={14} className="text-brand-indigo" />
              <a href={`mailto:${customEmail}`} className="hover:text-brand-blue transition-colors">
                {customEmail}
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Built for Digital Heroes Button */}
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-brand-indigo hover:border-brand-indigo hover:text-white shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              <span>Built for Digital Heroes</span>
              <ArrowUpRight size={14} className="text-brand-blue group-hover:text-white" />
            </a>
            
            <div className="text-[10px] text-gray-500 font-medium">
              &copy; {new Date().getFullYear()} ResumeIQ. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

