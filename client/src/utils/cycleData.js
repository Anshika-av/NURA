const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export const toDateKey = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value.slice(0, 10);
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return null;

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getLocalDateKey = (date = new Date()) => toDateKey(date);

const utcTimestamp = (dateKey) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
};

export const daysBetween = (laterDate, earlierDate) => {
  const laterKey = toDateKey(laterDate);
  const earlierKey = toDateKey(earlierDate);
  if (!laterKey || !earlierKey) return null;

  return Math.round((utcTimestamp(laterKey) - utcTimestamp(earlierKey)) / DAY_IN_MILLISECONDS);
};

export const addDays = (date, amount) => {
  const dateKey = toDateKey(date);
  if (!dateKey) return null;
  const [year, month, day] = dateKey.split("-").map(Number);
  const result = new Date(year, month - 1, day + amount);
  return getLocalDateKey(result);
};

export const formatDate = (date, options = { month: "short", day: "numeric" }) => {
  const dateKey = toDateKey(date);
  if (!dateKey) return "—";

  return new Intl.DateTimeFormat(undefined, options).format(
    new Date(`${dateKey}T12:00:00`)
  );
};

export const getCycleIntervals = (cycles) => {
  const starts = cycles
    .map((cycle) => toDateKey(cycle.startDate))
    .filter(Boolean)
    .sort();

  return starts.slice(1).flatMap((startDate, index) => {
    const days = daysBetween(startDate, starts[index]);
    return days >= 1 && days <= 120 ? [{ startDate, days }] : [];
  });
};

export const getPeriodEpisodes = (periodLogs) => {
  const logsByCycle = new Map();

  for (const log of periodLogs) {
    if (!log.endDate) continue;
    const logs = logsByCycle.get(log.cycleId) ?? [];
    logs.push(log);
    logsByCycle.set(log.cycleId, logs);
  }

  const episodes = [];
  for (const [cycleId, logs] of logsByCycle) {
    const sortedLogs = logs
      .map((log) => ({
        startDate: toDateKey(log.startDate),
        endDate: toDateKey(log.endDate),
      }))
      .filter((log) => log.startDate && log.endDate)
      .sort((a, b) => a.startDate.localeCompare(b.startDate));

    let episode = null;
    for (const log of sortedLogs) {
      if (!episode || daysBetween(log.startDate, episode.endDate) > 1) {
        if (episode) {
          episodes.push({
            cycleId,
            ...episode,
            duration: daysBetween(episode.endDate, episode.startDate) + 1,
          });
        }
        episode = { ...log };
      } else if (log.endDate > episode.endDate) {
        episode.endDate = log.endDate;
      }
    }

    if (episode) {
      episodes.push({
        cycleId,
        ...episode,
        duration: daysBetween(episode.endDate, episode.startDate) + 1,
      });
    }
  }

  return episodes.sort((a, b) => b.startDate.localeCompare(a.startDate));
};

export const getAverage = (values) => {
  if (values.length === 0) return null;
  return values.reduce((total, value) => total + value, 0) / values.length;
};

export const getCyclePhase = (cycleDay, cycleLength, periodLength) => {
  if (!cycleDay || cycleDay < 1 || !cycleLength) return null;

  const periodEnd = Math.min(periodLength, cycleLength);
  if (cycleDay <= periodEnd) return "Menstrual";

  const estimatedOvulationDay = Math.max(periodEnd + 1, cycleLength - 14);
  const estimatedFertileStart = Math.max(periodEnd + 1, estimatedOvulationDay - 2);
  const estimatedFertileEnd = Math.min(cycleLength, estimatedOvulationDay + 1);

  if (cycleDay < estimatedFertileStart) return "Follicular";
  if (cycleDay <= estimatedFertileEnd) return "Ovulatory";
  return "Luteal";
};
