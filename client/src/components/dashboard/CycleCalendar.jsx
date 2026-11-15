import { useMemo, useState } from "react";
import {
  addDays,
  formatDate,
  getLocalDateKey,
  toDateKey,
} from "../../utils/cycleData.js";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CycleCalendar({
  cycles,
  periodLogs,
  symptomLogs,
  nextPeriodDate,
}) {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(getLocalDateKey());
  const today = getLocalDateKey();

  const monthDates = useMemo(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    return Array.from(
      { length: daysInMonth },
      (_, index) => getLocalDateKey(new Date(year, monthIndex, index + 1))
    );
  }, [month]);

  const periodDates = useMemo(() => {
    const dates = new Set();
    for (const log of periodLogs) {
      const startDate = toDateKey(log.startDate);
      const endDate = toDateKey(log.endDate) ?? startDate;
      if (!startDate || !endDate || endDate < startDate) continue;

      let date = startDate;
      let count = 0;
      while (date <= endDate && count < 31) {
        dates.add(date);
        date = addDays(date, 1);
        count += 1;
      }
    }
    return dates;
  }, [periodLogs]);

  const cycleStartDates = useMemo(
    () => new Set(cycles.map((cycle) => toDateKey(cycle.startDate))),
    [cycles]
  );
  const symptomLogsByDate = useMemo(() => {
    const entries = new Map();
    for (const log of symptomLogs) {
      const date = toDateKey(log.date);
      if (date) entries.set(date, log);
    }
    return entries;
  }, [symptomLogs]);

  const previousMonth = () => {
    const next = new Date(month.getFullYear(), month.getMonth() - 1, 1);
    setMonth(next);
    setSelectedDate(getLocalDateKey(next));
  };
  const nextMonth = () => {
    const next = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    setMonth(next);
    setSelectedDate(getLocalDateKey(next));
  };

  const firstDayOffset = (month.getDay() + 6) % 7;
  const selectedSymptomLog = symptomLogsByDate.get(selectedDate);
  const selectedHasPeriod = periodDates.has(selectedDate);
  const selectedIsCycleStart = cycleStartDates.has(selectedDate);
  const selectedIsPrediction = selectedDate === nextPeriodDate;

  return (
    <div className="rounded-3xl border border-[#F0DDD5] bg-white/95 p-6 shadow-[0_4px_25px_rgba(84,43,53,0.04)] backdrop-blur-sm lg:p-8">
      <div className="flex items-center justify-between border-b border-[#F7EDE8] pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A83D55]">
            Cycle Tracking
          </span>
          <h2 className="font-serif text-2xl font-semibold text-[#542B35]">
            Menstrual Calendar
          </h2>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-[#F0DDD5] bg-[#FFF8F3] p-1">
          <button
            type="button"
            onClick={previousMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#806B68] transition hover:bg-white hover:text-[#542B35]"
            aria-label="Previous month"
          >
            ‹
          </button>
          <span className="min-w-28 px-2 text-center text-xs font-semibold text-[#542B35]">
            {formatDate(month, { month: "long", year: "numeric" })}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#806B68] transition hover:bg-white hover:text-[#542B35]"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1 text-center">
        {weekDays.map((day) => (
          <div key={day} className="py-1 text-[11px] font-semibold text-[#947875]">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 pt-2 sm:gap-2">
        {Array.from({ length: firstDayOffset }, (_, index) => (
          <div key={`empty-${index}`} className="h-10 rounded-xl sm:h-12" />
        ))}
        {monthDates.map((date) => {
          const hasPeriod = periodDates.has(date);
          const isCycleStart = cycleStartDates.has(date);
          const isPrediction = date === nextPeriodDate;
          const hasSymptoms = symptomLogsByDate.has(date);
          const isSelected = selectedDate === date;
          const isToday = today === date;
          const label = hasPeriod
            ? "Period logged"
            : isPrediction
              ? "Estimated period start"
              : hasSymptoms
                ? "Symptom log"
                : isCycleStart
                  ? "Cycle start"
                  : "No entry";

          let className = "border border-[#F0DDD5] bg-white text-[#542B35]";
          if (hasPeriod) {
            className = "border border-[#C94F6C] bg-[#C94F6C] text-white";
          } else if (isPrediction) {
            className = "border-2 border-dashed border-[#C94F6C] bg-[#FCE8EC]/50 text-[#A83D55]";
          } else if (isCycleStart) {
            className = "border border-[#E8C7BC] bg-[#FFF4EC] text-[#542B35]";
          }

          return (
            <button
              type="button"
              key={date}
              onClick={() => setSelectedDate(date)}
              aria-label={`${formatDate(date, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}: ${label}`}
              aria-pressed={isSelected}
              className={`relative flex h-10 flex-col items-center justify-center rounded-xl p-1 text-xs font-medium transition-all sm:h-12 ${className} ${
                isSelected ? "ring-2 ring-[#542B35] ring-offset-2 z-10 font-bold" : "hover:scale-[1.02]"
              } ${isToday ? "outline outline-1 outline-[#A83D55]" : ""}`}
            >
              <span>{Number(date.slice(-2))}</span>
              {(hasSymptoms || hasPeriod || isPrediction) && (
                <span
                  aria-hidden="true"
                  className={`mt-0.5 h-1.5 w-1.5 rounded-full ${
                    hasPeriod ? "bg-white" : "bg-[#A83D55]"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[#F7EDE8] pt-4 text-[11px] text-[#806B68]">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#C94F6C]" />
          Period logged
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border-2 border-dashed border-[#F6BFC1] bg-[#FCE8EC]" />
          Estimated period
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border border-[#E8C7BC] bg-[#FFF4EC]" />
          Cycle start
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#A83D55]" />
          Symptom log
        </span>
      </div>

      <div className="mt-4 rounded-2xl border border-[#F0DDD5] bg-[#FFF8F3] p-4 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-[#542B35]">
            {formatDate(selectedDate, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="rounded-full bg-[#FCE4E4] px-2.5 py-0.5 text-[11px] font-semibold text-[#A83D55]">
            {selectedHasPeriod
              ? "Period logged"
              : selectedIsPrediction
                ? "Estimated"
                : selectedIsCycleStart
                  ? "Cycle start"
                  : selectedSymptomLog
                    ? "Symptom log"
                    : "No entry"}
          </span>
        </div>
        {selectedSymptomLog ? (
          <div className="mt-2 space-y-1 text-[#806B68]">
            {selectedSymptomLog.mood && <p>Mood: {selectedSymptomLog.mood}</p>}
            {selectedSymptomLog.items?.length > 0 && (
              <p>
                Symptoms:{" "}
                {selectedSymptomLog.items
                  .map((item) => item.symptom.name)
                  .join(", ")}
              </p>
            )}
            {selectedSymptomLog.notes && <p>{selectedSymptomLog.notes}</p>}
          </div>
        ) : selectedHasPeriod ? (
          <p className="mt-2 text-[#806B68]">You recorded menstrual flow on this date.</p>
        ) : selectedIsPrediction ? (
          <p className="mt-2 text-[#806B68]">
            Estimated from your recorded cycle history; this date may vary.
          </p>
        ) : selectedIsCycleStart ? (
          <p className="mt-2 text-[#806B68]">A cycle start is recorded on this date.</p>
        ) : (
          <p className="mt-2 text-[#806B68]">No period or symptom record saved for this date.</p>
        )}
      </div>
    </div>
  );
}
