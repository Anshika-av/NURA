import { useState } from "react";
import { daysBetween, formatDate } from "../../utils/cycleData.js";

const phaseStyles = {
  Menstrual: {
    color: "#C94F6C",
    lightColor: "#FCE8EC",
    borderColor: "#F7C6D2",
    description: "Period timing is based on the flow entries you record.",
  },
  Follicular: {
    color: "#D97B55",
    lightColor: "#FFF0E6",
    borderColor: "#FAD8C3",
    description: "This phase estimate follows the recorded cycle start.",
  },
  Ovulatory: {
    color: "#A83D55",
    lightColor: "#FDE8E8",
    borderColor: "#F6BFC1",
    description: "This is a calendar estimate, not a fertility or medical assessment.",
  },
  Luteal: {
    color: "#7E3B4D",
    lightColor: "#F8ECEF",
    borderColor: "#E7CDD4",
    description: "Cycle timing varies; this phase estimate may not match your body.",
  },
};

const getPhaseRange = (phaseName, cycleLength, periodLength) => {
  const periodEnd = Math.min(Math.max(periodLength, 1), cycleLength);
  const ovulationDay = Math.min(
    cycleLength,
    Math.max(periodEnd + 1, cycleLength - 14)
  );
  const follicularStart = Math.min(periodEnd + 1, cycleLength);
  const fertileStart = Math.max(follicularStart, ovulationDay - 2);
  const fertileEnd = Math.max(
    fertileStart,
    Math.min(cycleLength, ovulationDay + 1)
  );
  const ranges = {
    Menstrual: [1, periodEnd],
    Follicular: [
      follicularStart,
      Math.max(follicularStart, Math.min(cycleLength, fertileStart - 1)),
    ],
    Ovulatory: [fertileStart, fertileEnd],
    Luteal: [Math.min(cycleLength, fertileEnd + 1), cycleLength],
  };
  const [start, end] = ranges[phaseName];
  return start === end ? `Day ${start}` : `Days ${start}–${end}`;
};

export default function CycleOverview({
  cycleDay,
  cycleLength,
  periodLength,
  phaseName,
  nextPeriodDate,
}) {
  const [selectedPhase, setSelectedPhase] = useState(phaseName ?? "Menstrual");
  const phaseNames = Object.keys(phaseStyles);

  const activePhase = phaseStyles[selectedPhase] ?? phaseStyles.Menstrual;
  const currentDate = new Date();
  const daysUntilNextPeriod = nextPeriodDate
    ? daysBetween(nextPeriodDate, currentDate)
    : null;
  const markerCount = Math.min(Math.max(cycleLength, 1), 35);
  const currentMarker = cycleDay
    ? Math.round(((cycleDay - 1) / Math.max(cycleLength - 1, 1)) * (markerCount - 1))
    : -1;
  const ticks = Array.from({ length: markerCount }, (_, index) => {
    const angle = (index * (360 / markerCount) - 90) * (Math.PI / 180);
    const radius = 100;
    return {
      x: 120 + radius * Math.cos(angle),
      y: 120 + radius * Math.sin(angle),
      isCurrentDay: index === currentMarker,
    };
  });

  return (
    <div className="overflow-hidden rounded-3xl border border-[#F0DDD5] bg-white/95 p-6 shadow-[0_4px_25px_rgba(84,43,53,0.04)] backdrop-blur-sm lg:p-8">
      <div className="flex flex-col gap-4 border-b border-[#F7EDE8] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE4E4] px-3 py-1 text-xs font-semibold text-[#A83D55]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A83D55]" />
            {phaseName ? `Estimated phase: ${phaseName}` : "No active cycle"}
          </span>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-[#542B35] sm:text-3xl">
            Your Cycle Rhythm
          </h2>
          <p className="text-xs text-[#806B68] sm:text-sm">
            {cycleDay
              ? `Estimated cycle day ${cycleDay} of ${cycleLength}, based on your latest active cycle.`
              : "Log a period start to see your cycle day and phase estimate."}
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#F5D7BB] bg-gradient-to-r from-[#FFF6F0] to-[#FFF0E6] p-3.5 sm:px-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#C94F6C] shadow-xs">
            <span aria-hidden="true" className="text-lg">◷</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A18480]">
              Estimated Next Period
            </p>
            <p className="font-serif text-lg font-bold text-[#542B35]">
              {nextPeriodDate ? formatDate(nextPeriodDate, {
                month: "short",
                day: "numeric",
                year: "numeric",
              }) : "Not available"}
              {daysUntilNextPeriod !== null && (
                <span className="ml-1 text-xs font-normal text-[#806B68]">
                  ({daysUntilNextPeriod === 0 ? "due today" : `${daysUntilNextPeriod} days`})
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        <div className="flex flex-col items-center justify-center lg:col-span-5">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-48 w-48 rounded-full bg-gradient-to-br from-[#FCE4E4] to-[#F5D7BB] opacity-60 blur-xl" />
            <svg
              width="240"
              height="240"
              viewBox="0 0 240 240"
              className="relative z-10"
              role="img"
              aria-label={cycleDay ? `Estimated cycle day ${cycleDay}` : "No active cycle"}
            >
              <circle
                cx="120"
                cy="120"
                r="100"
                fill="none"
                stroke="#F3E5DF"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <circle
                cx="120"
                cy="120"
                r="78"
                fill="#FFFDFB"
                stroke="#F7ECE8"
                strokeWidth="1"
              />
              {ticks.map((tick, index) => (
                <circle
                  key={index}
                  cx={tick.x}
                  cy={tick.y}
                  r={tick.isCurrentDay ? 7 : 4}
                  fill={tick.isCurrentDay ? "#A83D55" : "#EBC9A9"}
                  stroke={tick.isCurrentDay ? "#FFFFFF" : "none"}
                  strokeWidth="2"
                />
              ))}
            </svg>
            <div className="absolute z-20 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#A18480]">
                Cycle Day
              </span>
              <span className="font-serif text-5xl font-bold tracking-tight text-[#542B35]">
                {cycleDay ?? "—"}
              </span>
              <span className="mt-1 rounded-full bg-[#FCE4E4] px-2.5 py-0.5 text-[11px] font-semibold text-[#A83D55]">
                {phaseName ?? "Not logged"}
              </span>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-center text-[11px] text-[#806B68]">
            Phase timing is an estimate based on recorded dates and preferences.
          </p>
        </div>

        <div className="space-y-5 lg:col-span-7">
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#F0DDD5] bg-[#FFF8F3] p-1.5 sm:grid-cols-4">
            {phaseNames.map((name) => {
              const phase = phaseStyles[name];
              const isSelected = selectedPhase === name;
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedPhase(name)}
                  className={`flex flex-col items-center rounded-xl px-1 py-2 text-center transition-all ${
                    isSelected
                      ? "border border-[#F0DDD5] bg-white font-semibold text-[#542B35] shadow-xs"
                      : "text-[#806B68] hover:bg-white/50"
                  }`}
                >
                  <span className="text-xs">{name}</span>
                  <span className="text-[10px] text-[#A18480]">
                    {getPhaseRange(name, cycleLength, periodLength)}
                  </span>
                  <span
                    className="mt-1 h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: phase.color }}
                  />
                </button>
              );
            })}
          </div>

          <div
            className="rounded-2xl border p-5 transition-all duration-300"
            style={{
              backgroundColor: activePhase.lightColor,
              borderColor: activePhase.borderColor,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#542B35]">
                  {selectedPhase} Phase
                </h3>
                <p className="text-xs text-[#806B68]">
                  {getPhaseRange(selectedPhase, cycleLength, periodLength)}
                </p>
              </div>
              {selectedPhase === phaseName && phaseName && (
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: activePhase.color }}
                >
                  Current estimate
                </span>
              )}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#542B35]">
              {activePhase.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
