import { useState } from "react";

export default function CycleCalendar() {
  const [selectedDay, setSelectedDay] = useState(14);

  // November 2026: Nov 1 starts on a Sunday (or adjust for standard Monday-start calendar)
  // Let's create a standard calendar for November 2026 (30 days)
  // Starting day of week for Nov 1, 2026: Sunday. With Mon as first col, Nov 1 is 7th col (index 6).
  const daysInMonth = 30;
  const startDayOffset = 6; // Mon-first: Sun is 6

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getDayInfo = (day) => {
    if (day >= 1 && day <= 5) {
      return {
        type: "period",
        label: "Period",
        phase: "Menstrual Phase",
        bg: "bg-[#C94F6C] text-white",
        dot: "bg-white",
        desc: "Actual period recorded. Flow: Medium to Light.",
      };
    }
    if (day >= 6 && day <= 11) {
      return {
        type: "follicular",
        label: "Follicular",
        phase: "Follicular Phase",
        bg: "bg-[#FFF4EC] text-[#542B35] border border-[#F5D7BB]",
        dot: "bg-[#D97B55]",
        desc: "Estrogen rising. Mental clarity and vitality building.",
      };
    }
    if (day === 12 || day === 13 || day === 15 || day === 16) {
      return {
        type: "fertile",
        label: "Fertile Window",
        phase: "Fertile Window",
        bg: "bg-[#FCE4E4] text-[#A83D55] border border-[#F6BFC1]",
        dot: "bg-[#E77D91]",
        desc: "High chance of conception. High energy and glow.",
      };
    }
    if (day === 14) {
      return {
        type: "ovulation",
        label: "Ovulation Day",
        phase: "Ovulation Peak",
        bg: "bg-[#A83D55] text-white shadow-sm ring-2 ring-[#E77D91]",
        dot: "bg-[#FFF8F3]",
        desc: "Egg release predicted today. Peak LH & Estrogen.",
      };
    }
    if (day >= 17 && day <= 27) {
      return {
        type: "luteal",
        label: "Luteal",
        phase: "Luteal Phase",
        bg: "bg-[#FFF8F3] text-[#542B35] border border-[#F0DDD5]",
        dot: "bg-[#A18480]",
        desc: "Progesterone dominance. Calmer mindset, steady focus.",
      };
    }
    if (day >= 28 && day <= 30) {
      return {
        type: "predicted",
        label: "Predicted Period",
        phase: "Predicted Menstruation",
        bg: "bg-[#FCE8EC]/50 text-[#C94F6C] border-2 border-dashed border-[#F6BFC1]",
        dot: "bg-[#C94F6C]",
        desc: "Next cycle start estimated. Have supplies on hand.",
      };
    }
    return {
      type: "regular",
      label: "Cycle Day",
      phase: "Cycle",
      bg: "bg-white text-[#542B35] border border-[#F0DDD5]",
      dot: "bg-[#E0CDC6]",
      desc: "Standard cycle day.",
    };
  };

  const selectedDayInfo = getDayInfo(selectedDay);

  return (
    <div className="rounded-3xl border border-[#F0DDD5] bg-white/95 p-6 shadow-[0_4px_25px_rgba(84,43,53,0.04)] backdrop-blur-sm lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F7EDE8] pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A83D55]">
            Cycle Tracking
          </span>
          <h2 className="font-serif text-2xl font-semibold text-[#542B35]">
            Menstrual Calendar
          </h2>
          <p className="text-xs text-[#806B68]">
            November 2026 • Cycle 8
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-[#F0DDD5] bg-[#FFF8F3] p-1">
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#806B68] hover:bg-white hover:text-[#542B35] transition"
            aria-label="Previous month"
          >
            ‹
          </button>
          <span className="px-2 text-xs font-semibold text-[#542B35]">
            November 2026
          </span>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#806B68] hover:bg-white hover:text-[#542B35] transition"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="mt-5 grid grid-cols-7 gap-1 text-center">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-1 text-[11px] font-semibold text-[#947875]">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-2">
        {/* Empty slots before month starts */}
        {Array.from({ length: startDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10 sm:h-12 rounded-xl opacity-20" />
        ))}

        {/* Month days 1 to 30 */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNumber = i + 1;
          const info = getDayInfo(dayNumber);
          const isSelected = selectedDay === dayNumber;

          return (
            <button
              key={dayNumber}
              onClick={() => setSelectedDay(dayNumber)}
              className={`relative flex h-10 sm:h-12 flex-col items-center justify-center rounded-xl p-1 text-xs font-medium transition-all duration-200 ${
                info.bg
              } ${
                isSelected
                  ? "ring-2 ring-[#542B35] ring-offset-2 scale-105 z-10 font-bold"
                  : "hover:scale-[1.02]"
              }`}
            >
              <span>{dayNumber}</span>
              {/* Dot indicator */}
              <span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${info.dot}`} />
            </button>
          );
        })}
      </div>

      {/* Calendar Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#F7EDE8] pt-4 text-[11px] text-[#806B68]">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#C94F6C]" />
          <span>Period</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#FCE4E4] border border-[#F6BFC1]" />
          <span>Fertile Window</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#A83D55] ring-2 ring-[#E77D91]" />
          <span>Ovulation Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border-2 border-dashed border-[#F6BFC1] bg-[#FCE8EC]" />
          <span>Predicted Period</span>
        </div>
      </div>

      {/* Selected Day Inspector */}
      <div className="mt-4 rounded-2xl border border-[#F0DDD5] bg-[#FFF8F3] p-4 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#542B35]">
            Selected: November {selectedDay}, 2026
          </span>
          <span className="rounded-full bg-[#FCE4E4] px-2.5 py-0.5 text-[11px] font-semibold text-[#A83D55]">
            {selectedDayInfo.phase}
          </span>
        </div>
        <p className="mt-1 text-[#806B68] leading-relaxed">
          {selectedDayInfo.desc}
        </p>
      </div>
    </div>
  );
}
