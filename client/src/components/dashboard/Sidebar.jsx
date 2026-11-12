import { useId } from "react";
import { Link } from "react-router-dom";

function NuraLogo({ size = 34 }) {
  const id = useId().replace(/:/g, "");

  const colors = [
    "#E77D91", // Warm Pink
    "#EBC9A9", // Soft Peach
    "#A83D55", // Berry
    "#F6BFC1", // Dusty Rose
    "#E77D91", // Warm Pink
    "#EBC9A9", // Soft Peach
    "#A83D55", // Berry
    "#F6BFC1", // Dusty Rose
  ];

  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        role="img"
        aria-label="Nura flower logo"
      >
        <defs>
          {colors.map((color, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const tipX = 32 + 27 * Math.sin(angle);
            const tipY = 32 - 27 * Math.cos(angle);

            return (
              <linearGradient
                key={i}
                id={`${id}-petal-${i}`}
                gradientUnits="userSpaceOnUse"
                x1="32"
                y1="32"
                x2={tipX}
                y2={tipY}
              >
                <stop offset="0%" stopColor="#FFF7F2" />
                <stop offset="35%" stopColor="#FCE4E4" />
                <stop offset="70%" stopColor="#F6BFC1" />
                <stop offset="100%" stopColor={color} />
              </linearGradient>
            );
          })}
        </defs>
        {colors.map((_, i) => {
          const rotation = i * 45;
          return (
            <path
              key={i}
              d="M32 32 C 26 21, 26 8, 32 5 C 38 8, 38 21, 32 32 Z"
              fill={`url(#${id}-petal-${i})`}
              transform={`rotate(${rotation} 32 32)`}
              opacity="0.9"
            />
          );
        })}
        <circle cx="32" cy="32" r="4.2" fill="#FAF0EA" />
        <circle cx="32" cy="32" r="2.4" fill="#A83D55" />
      </svg>
      <span className="font-serif text-2xl tracking-wide text-[#542B35]">
        nura
      </span>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose, activeTab, setActiveTab }) {
  const navigation = [
    {
      id: "overview",
      name: "Cycle Overview",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: "calendar",
      name: "Menstrual Calendar",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: "log",
      name: "Daily Symptom Log",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      id: "analytics",
      name: "Hormone Analytics",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: "insights",
      name: "Health Library",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#542B35]/25 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-[#F0DDD5] bg-[#FFF8F3]/95 backdrop-blur-md px-6 py-7 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          {/* Header & Logo */}
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-block hover:opacity-90 transition">
              <NuraLogo size={36} />
            </Link>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#806B68] hover:bg-[#FCE4E4] hover:text-[#542B35] lg:hidden"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#A18480]">
              Personal Hub
            </p>
            {navigation.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#FCE4E4] text-[#A83D55] shadow-xs"
                      : "text-[#806B68] hover:bg-[#F7EDE8] hover:text-[#542B35]"
                  }`}
                >
                  <span
                    className={`transition-colors ${
                      isActive ? "text-[#A83D55]" : "text-[#A18480]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-[#A83D55]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Cycle Phase Badge Card */}
          <div className="rounded-2xl border border-[#F3DFD8] bg-gradient-to-br from-[#FFF4ED] to-[#FDE8E8] p-4 text-[#542B35] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A83D55]">
                Today's Phase
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E77D91] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A83D55]"></span>
              </span>
            </div>
            <p className="mt-1 font-serif text-lg font-medium text-[#542B35]">
              Ovulation Peak
            </p>
            <p className="mt-1 text-xs text-[#806B68] leading-relaxed">
              Energy is at its monthly high. High confidence and natural vitality.
            </p>
          </div>
        </div>

        {/* Bottom Profile and Landing Page return */}
        <div className="space-y-3 pt-6 border-t border-[#F0DDD5]">
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#806B68] transition hover:bg-[#F7EDE8] hover:text-[#542B35]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Return to Landing Page</span>
          </Link>

          <div className="flex items-center gap-3 rounded-2xl bg-white/80 border border-[#F0DDD5] p-3 shadow-xs">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E77D91] to-[#A83D55] text-sm font-semibold text-white shadow-xs">
              ER
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#542B35]">
                Elena Rostova
              </p>
              <p className="truncate text-[11px] text-[#A18480]">
                Cycle Day 14 • Bloom
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
