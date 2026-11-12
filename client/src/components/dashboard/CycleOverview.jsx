import { useState } from "react";

export default function CycleOverview() {
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(2); // Default to Ovulatory (index 2)

  const cycleDaysTotal = 28;
  const currentCycleDay = 14;

  const phases = [
    {
      name: "Menstrual",
      days: "Days 1–5",
      color: "#C94F6C",
      lightColor: "#FCE8EC",
      borderColor: "#F7C6D2",
      description: "Uterine lining sheds. Progesterone & estrogen are at their lowest.",
      hormones: "Low Estrogen & Progesterone",
      energy: "Reflective, restorative rest",
      nutrition: "Iron-rich foods, warm broths, cacao",
      movement: "Gentle yoga, slow walks, stretching",
    },
    {
      name: "Follicular",
      days: "Days 6–12",
      color: "#D97B55",
      lightColor: "#FFF0E6",
      borderColor: "#FAD8C3",
      description: "Follicles mature. Estrogen rises, boosting stamina, mood, and mental focus.",
      hormones: "Rising Estrogen, low Progesterone",
      energy: "Building motivation & creativity",
      nutrition: "Fermented foods, lean proteins, sprout salads",
      movement: "Cardio, dance, moderate strength training",
    },
    {
      name: "Ovulatory",
      days: "Days 13–16",
      color: "#A83D55",
      lightColor: "#FDE8E8",
      borderColor: "#F6BFC1",
      description: "Estrogen & LH peak. The egg is released. Peak social energy and communication.",
      hormones: "Peak LH & Estrogen Surge",
      energy: "Highest vitality, high confidence",
      nutrition: "Cruciferous greens, berries, magnesium",
      movement: "High-intensity intervals, power lifting",
    },
    {
      name: "Luteal",
      days: "Days 17–28",
      color: "#7E3B4D",
      lightColor: "#F8ECEF",
      borderColor: "#E7CDD4",
      description: "Progesterone rises to support the body, then tapers off prior to menstruation.",
      hormones: "Progesterone dominant, declining estrogen",
      energy: "Deep focus, winding down",
      nutrition: "Complex carbs, roasted root vegetables",
      movement: "Pilates, bodyweight resistance, swimming",
    },
  ];

  const activePhase = phases[selectedPhaseIndex];

  // Calculate coordinates for the 28 tick marks on circular ring
  const ticks = Array.from({ length: cycleDaysTotal }, (_, i) => {
    const day = i + 1;
    const angle = (i * (360 / cycleDaysTotal) - 90) * (Math.PI / 180);
    const radius = 100;
    const x = 120 + radius * Math.cos(angle);
    const y = 120 + radius * Math.sin(angle);

    let phaseColor;
    if (day <= 5) phaseColor = "#C94F6C"; // Menstrual
    else if (day <= 12) phaseColor = "#EBC9A9"; // Follicular
    else if (day <= 16) phaseColor = "#E77D91"; // Ovulatory
    else phaseColor = "#A83D55"; // Luteal

    const isCurrentDay = day === currentCycleDay;

    return { day, x, y, phaseColor, isCurrentDay };
  });

  return (
    <div className="overflow-hidden rounded-3xl border border-[#F0DDD5] bg-white/95 p-6 shadow-[0_4px_25px_rgba(84,43,53,0.04)] backdrop-blur-sm lg:p-8">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#F7EDE8] pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE4E4] px-3 py-1 text-xs font-semibold text-[#A83D55]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A83D55] animate-pulse" />
            Active Cycle Phase: {phases[2].name}
          </span>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-semibold text-[#542B35]">
            Your Cycle Rhythm
          </h2>
          <p className="text-xs sm:text-sm text-[#806B68]">
            Day 14 of 28 • Predicted ovulation peak occurs today
          </p>
        </div>

        {/* Next Period Summary Box */}
        <div className="flex items-center gap-4 rounded-2xl border border-[#F5D7BB] bg-gradient-to-r from-[#FFF6F0] to-[#FFF0E6] p-3.5 sm:px-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#C94F6C] shadow-xs">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A18480]">
              Next Period Expected
            </p>
            <p className="font-serif text-lg font-bold text-[#542B35]">
              Nov 26 <span className="text-xs font-normal text-[#806B68]">(in 14 days)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Dial + Phase Breakdown */}
      <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Left: Cycle Ring Dial (5 cols) */}
        <div className="flex flex-col items-center justify-center lg:col-span-5">
          <div className="relative flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute h-48 w-48 rounded-full bg-gradient-to-br from-[#FCE4E4] to-[#F5D7BB] opacity-60 blur-xl" />

            {/* SVG Ring Dial */}
            <svg width="240" height="240" viewBox="0 0 240 240" className="relative z-10">
              {/* Outer decorative tracks */}
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

              {/* Day markers */}
              {ticks.map((t) => (
                <g key={t.day}>
                  {t.isCurrentDay ? (
                    <>
                      {/* Pulsing ring around current day */}
                      <circle
                        cx={t.x}
                        cy={t.y}
                        r="11"
                        fill="#C94F6C"
                        opacity="0.25"
                        className="animate-ping"
                      />
                      <circle
                        cx={t.x}
                        cy={t.y}
                        r="8"
                        fill="#A83D55"
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                      />
                    </>
                  ) : (
                    <circle
                      cx={t.x}
                      cy={t.y}
                      r={t.day <= 5 ? 5 : t.day <= 12 ? 4 : t.day <= 16 ? 4.5 : 4}
                      fill={t.phaseColor}
                      opacity={t.day <= 14 ? 1 : 0.65}
                    />
                  )}
                </g>
              ))}
            </svg>

            {/* Center Dial Text */}
            <div className="absolute z-20 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#A18480]">
                Cycle Day
              </span>
              <span className="font-serif text-5xl font-bold tracking-tight text-[#542B35]">
                {currentCycleDay}
              </span>
              <span className="mt-1 rounded-full bg-[#FCE4E4] px-2.5 py-0.5 text-[11px] font-semibold text-[#A83D55]">
                Ovulatory Phase
              </span>
              <span className="mt-1 text-[11px] text-[#806B68]">
                High conception odds
              </span>
            </div>
          </div>

          {/* Quick Ring Legend */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#806B68]">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#C94F6C]" />
              Menstrual (1-5)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#EBC9A9]" />
              Follicular (6-12)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E77D91]" />
              Ovulatory (13-16)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#A83D55]" />
              Luteal (17-28)
            </span>
          </div>
        </div>

        {/* Right: Phase Details & Interactive Exploration (7 cols) */}
        <div className="space-y-5 lg:col-span-7">
          {/* Phase Switcher Tabs */}
          <div className="grid grid-cols-4 gap-2 rounded-2xl bg-[#FFF8F3] p-1.5 border border-[#F0DDD5]">
            {phases.map((p, idx) => {
              const isSelected = selectedPhaseIndex === idx;
              return (
                <button
                  key={p.name}
                  onClick={() => setSelectedPhaseIndex(idx)}
                  className={`flex flex-col items-center rounded-xl py-2 px-1 text-center transition-all duration-200 ${
                    isSelected
                      ? "bg-white text-[#542B35] shadow-xs font-semibold border border-[#F0DDD5]"
                      : "text-[#806B68] hover:text-[#542B35] hover:bg-white/50"
                  }`}
                >
                  <span className="text-xs">{p.name}</span>
                  <span className="text-[10px] text-[#A18480]">{p.days}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Phase Detail Card */}
          <div
            className="rounded-2xl border p-5 transition-all duration-300"
            style={{
              backgroundColor: activePhase.lightColor,
              borderColor: activePhase.borderColor,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#542B35]">
                  {activePhase.name} Phase
                </h3>
                <p className="text-xs text-[#806B68]">{activePhase.days} • {activePhase.description}</p>
              </div>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: activePhase.color }}
              >
                {activePhase.name === "Ovulatory" ? "Current Phase" : "Explore"}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white/80 p-3 border border-[#F5E1DB] shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#947875]">
                  Hormone State
                </p>
                <p className="mt-1 text-xs font-semibold text-[#542B35]">
                  {activePhase.hormones}
                </p>
              </div>

              <div className="rounded-xl bg-white/80 p-3 border border-[#F5E1DB] shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#947875]">
                  Nourishment Focus
                </p>
                <p className="mt-1 text-xs font-semibold text-[#542B35]">
                  {activePhase.nutrition}
                </p>
              </div>

              <div className="rounded-xl bg-white/80 p-3 border border-[#F5E1DB] shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#947875]">
                  Movement Guide
                </p>
                <p className="mt-1 text-xs font-semibold text-[#542B35]">
                  {activePhase.movement}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
