export default function Topbar({
  onMenuClick,
  onQuickLogClick,
  onReminderClick,
  userName,
  cycleDay,
  phaseName,
  reminderCount,
}) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const firstName = userName?.trim().split(/\s+/)[0] || "there";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#F0DDD5] bg-[#FFF8F3]/90 px-6 py-4 backdrop-blur-md transition-all">
      {/* Left: Mobile Menu Toggle + Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#F0DDD5] bg-white text-[#542B35] shadow-xs lg:hidden hover:bg-[#FCE4E4] transition"
          aria-label="Open menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-xl sm:text-2xl font-semibold text-[#542B35]">
              Hello, {firstName}
            </h1>
            <span className="hidden sm:inline-block text-lg">✨</span>
          </div>
          <p className="text-xs text-[#806B68]">
            {cycleDay
              ? `Estimated cycle day ${cycleDay}${phaseName ? ` · ${phaseName} phase estimate` : ""}`
              : "Log a period start to view cycle estimates"}
          </p>
        </div>
      </div>

      {/* Right: Date, Notifications, Quick Action */}
      <div className="flex items-center gap-3">
        {/* Date Pill */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-[#F0DDD5] bg-white/80 px-3.5 py-1.5 text-xs text-[#806B68] shadow-xs">
          <svg className="h-3.5 w-3.5 text-[#A83D55]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{currentDate}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={onReminderClick}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#F0DDD5] bg-white text-[#806B68] shadow-xs hover:border-[#E8C7BC] hover:text-[#542B35] transition"
            aria-label={`Upcoming reminders: ${reminderCount}`}
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {reminderCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#A83D55] px-1 text-[9px] font-semibold text-white">
                {reminderCount > 9 ? "9+" : reminderCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick Log Action Button */}
        <button
          onClick={onQuickLogClick}
          className="flex items-center gap-2 rounded-xl bg-[#C94F6C] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-[#C94F6C]/20 transition-all hover:bg-[#AA3D59] hover:shadow-lg hover:shadow-[#C94F6C]/30 active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Log Symptoms</span>
          <span className="sm:hidden">Log</span>
        </button>
      </div>
    </header>
  );
}
