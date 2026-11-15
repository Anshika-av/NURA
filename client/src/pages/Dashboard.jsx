import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar.jsx";
import Topbar from "../components/dashboard/Topbar.jsx";
import StatCard from "../components/dashboard/StatCard.jsx";
import CycleOverview from "../components/dashboard/CycleOverview.jsx";
import QuickLog from "../components/dashboard/QuickLog.jsx";
import CycleCalendar from "../components/dashboard/CycleCalendar.jsx";
import Insights from "../components/dashboard/Insights.jsx";
import UpcomingReminders from "../components/dashboard/UpcomingReminders.jsx";
import {
  addDays,
  daysBetween,
  getAverage,
  getCyclePhase,
  getLocalDateKey,
  getPeriodEpisodes,
  toDateKey,
} from "../utils/cycleData.js";
import {
  cycleApi,
  insightsApi,
  reminderApi,
  symptomApi,
  userApi,
} from "../api";

// Icons for StatCards
function CycleIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function DropIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );
}

function SparkleIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function HeartIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const logRef = useRef(null);
  const remindersRef = useRef(null);

  const loadDashboardData = useCallback(async () => {
    try {
      const [
        cyclesResponse,
        symptomLogsResponse,
        symptomsResponse,
        insightsResponse,
        remindersResponse,
        profileResponse,
      ] = await Promise.all([
        cycleApi.getCycles({ page: 1, limit: 100 }),
        symptomApi.getLogs({ page: 1, limit: 100 }),
        symptomApi.getSymptoms(),
        insightsApi.getInsights(),
        reminderApi.getReminders({ page: 1, limit: 100 }),
        userApi.getProfile(),
      ]);

      const cycles = cyclesResponse?.data?.cycles;
      const symptomLogs = symptomLogsResponse?.data?.logs;
      const symptoms = symptomsResponse?.data;
      const insights = insightsResponse?.data;
      const reminders = remindersResponse?.data?.reminders;
      const profile = profileResponse?.data;

      if (
        !Array.isArray(cycles) ||
        !Array.isArray(symptomLogs) ||
        !Array.isArray(symptoms) ||
        !Array.isArray(reminders) ||
        !profile ||
        !insights
      ) {
        throw new Error("The dashboard received an incomplete response from the server.");
      }

      setDashboardData({
        cycles,
        periodLogs: cycles.flatMap((cycle) => cycle.periodLogs ?? []),
        symptomLogs,
        symptomLogCount: symptomLogsResponse.data.pagination?.total ?? symptomLogs.length,
        symptoms,
        insights,
        reminders,
        profile,
      });
      setError("");
    } catch (loadError) {
      setError(loadError.message || "Unable to load your dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadDashboardData);
  }, [loadDashboardData]);

  const cycleSummary = useMemo(() => {
    if (!dashboardData) return null;

    const today = getLocalDateKey();
    const cycles = [...dashboardData.cycles].sort((a, b) =>
      toDateKey(b.startDate).localeCompare(toDateKey(a.startDate))
    );
    const activeCycle = cycles.find((cycle) => cycle.status === "active") ?? null;
    const latestCycle = cycles[0] ?? null;
    const insightAverage = Number(dashboardData.insights.cycles?.averageCycleLength);
    const hasCycleHistory =
      Number(dashboardData.insights.cycles?.intervalCount) > 0 &&
      Number.isFinite(insightAverage) &&
      insightAverage > 0;
    const preferenceCycleLengthValue = Number(
      dashboardData.profile.preferences?.cycleLength
    );
    const preferenceCycleLength =
      Number.isFinite(preferenceCycleLengthValue) && preferenceCycleLengthValue > 0
        ? preferenceCycleLengthValue
        : null;
    const averageCycleLength =
      Number.isFinite(insightAverage) && insightAverage > 0
        ? insightAverage
        : preferenceCycleLength;

    const periodEpisodes = getPeriodEpisodes(dashboardData.periodLogs);
    const recordedPeriodAverage = getAverage(
      periodEpisodes
        .filter((episode) => episode.endDate < today)
        .slice(0, 6)
        .map((episode) => episode.duration)
    );
    const preferencePeriodLengthValue = Number(
      dashboardData.profile.preferences?.periodLength
    );
    const preferencePeriodLength =
      Number.isFinite(preferencePeriodLengthValue) && preferencePeriodLengthValue > 0
        ? preferencePeriodLengthValue
        : null;
    const averagePeriodLength = recordedPeriodAverage ?? preferencePeriodLength ?? null;
    const cycleDay = activeCycle
      ? daysBetween(today, activeCycle.startDate) + 1
      : null;
    const nextPeriodCandidate =
      latestCycle && averageCycleLength
        ? addDays(latestCycle.startDate, Math.round(averageCycleLength))
        : null;
    const nextPeriodDate =
      nextPeriodCandidate && nextPeriodCandidate >= today
        ? nextPeriodCandidate
        : null;
    const cycleLengthForPhase = averageCycleLength
      ? Math.round(averageCycleLength)
      : preferenceCycleLength;
    const periodLength = Math.min(
      Math.round(recordedPeriodAverage ?? preferencePeriodLength ?? 5),
      cycleLengthForPhase || 28
    );

    return {
      activeCycle,
      averageCycleLength,
      averageCycleSource: hasCycleHistory ? "history" : "preference",
      averagePeriodLength,
      averagePeriodSource: recordedPeriodAverage ? "history" : "preference",
      cycleDay,
      cycleLength: cycleLengthForPhase || 28,
      latestCycle,
      nextPeriodDate,
      periodLength,
      phase: getCyclePhase(cycleDay, cycleLengthForPhase, periodLength),
      periodEpisodes,
    };
  }, [dashboardData]);

  const saveDailyEntry = useCallback(async (entry) => {
    if (!dashboardData) {
      throw new Error("Dashboard data is not ready yet. Please try again.");
    }

    const existingSymptomLog = dashboardData.symptomLogs.find(
      (log) => toDateKey(log.date) === entry.date
    );
    const hasSymptomData = Boolean(
      entry.mood || entry.notes.trim() || entry.items.length
    );
    let symptomLogSaved = false;

    if (hasSymptomData || existingSymptomLog) {
      const payload = {
        date: entry.date,
        mood: entry.mood || null,
        notes: entry.notes.trim() || null,
        items: entry.items,
      };

      if (existingSymptomLog) {
        await symptomApi.updateLog(existingSymptomLog.id, payload);
      } else {
        await symptomApi.createLog(payload);
      }
      symptomLogSaved = true;
    }

    try {
      const periodLog = dashboardData.periodLogs.find((log) => {
        const startDate = toDateKey(log.startDate);
        const endDate = toDateKey(log.endDate);
        return (
          startDate <= entry.date &&
          (!endDate || endDate >= entry.date)
        );
      });

      if (!entry.flowIntensity) {
        if (periodLog) {
          if (toDateKey(periodLog.startDate) < entry.date) {
            await cycleApi.updatePeriodLog(periodLog.cycleId, periodLog.id, {
              endDate: addDays(entry.date, -1),
            });
          } else {
            await cycleApi.deletePeriodLog(periodLog.cycleId, periodLog.id);
          }
          const ownerCycle = dashboardData.cycles.find(
            (cycle) => cycle.id === periodLog.cycleId
          );
          if (
            toDateKey(periodLog.startDate) === entry.date &&
            ownerCycle?.status === "active" &&
            toDateKey(ownerCycle.startDate) === entry.date &&
            ownerCycle.periodLogs?.length === 1
          ) {
            await cycleApi.deleteCycle(ownerCycle.id);
          }
        }
      } else if (periodLog) {
        await cycleApi.updatePeriodLog(periodLog.cycleId, periodLog.id, {
          flowIntensity: entry.flowIntensity,
        });
      } else {
        const previousPeriodLog = dashboardData.periodLogs
          .filter((log) => toDateKey(log.startDate) <= entry.date)
          .sort((a, b) => toDateKey(b.startDate).localeCompare(toDateKey(a.startDate)))[0];
        const daysSincePreviousFlow = previousPeriodLog
          ? daysBetween(entry.date, previousPeriodLog.startDate)
          : null;
        const periodContinues =
          daysSincePreviousFlow !== null &&
          daysSincePreviousFlow >= 0 &&
          daysSincePreviousFlow <= 6;
        let targetCycle = periodContinues
          ? dashboardData.cycles.find(
              (cycle) => cycle.id === previousPeriodLog.cycleId
            )
          : null;
        const activeCycle = dashboardData.cycles
          .filter(
            (cycle) =>
              cycle.status === "active" &&
              toDateKey(cycle.startDate) <= entry.date
          )
          .sort((a, b) =>
            toDateKey(b.startDate).localeCompare(toDateKey(a.startDate))
          )[0];

        if (
          !targetCycle &&
          activeCycle &&
          daysBetween(entry.date, activeCycle.startDate) <= 6
        ) {
          targetCycle = activeCycle;
        }

        if (!targetCycle) {
          const previousDay = addDays(entry.date, -1);
          for (const cycle of dashboardData.cycles) {
            if (
              cycle.status === "active" &&
              toDateKey(cycle.startDate) < entry.date
            ) {
              await cycleApi.updateCycle(cycle.id, { endDate: previousDay });
            }
          }

          const cycleResponse = await cycleApi.createCycle({
            startDate: entry.date,
          });
          targetCycle = cycleResponse?.data;
        }

        if (!targetCycle?.id) {
          throw new Error("The period flow was not saved because a cycle could not be created.");
        }

        await cycleApi.createPeriodLog(targetCycle.id, {
          startDate: entry.date,
          endDate: entry.date,
          flowIntensity: entry.flowIntensity,
        });
      }
    } catch (periodError) {
      if (symptomLogSaved) {
        throw new Error(
          `Your symptom log was saved, but period flow could not be saved: ${periodError.message}`,
          { cause: periodError }
        );
      }
      throw periodError;
    }

    await loadDashboardData();
  }, [dashboardData, loadDashboardData]);

  const scrollToLog = () => {
    setActiveTab("overview");
    if (logRef.current) {
      logRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToReminders = () => {
    setActiveTab("overview");
    remindersRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const currentSymptomLog = dashboardData?.symptomLogs.find(
    (log) => toDateKey(log.date) === getLocalDateKey()
  );
  const todayKey = getLocalDateKey();
  const currentPeriodLog = dashboardData?.periodLogs.find((log) => {
    const startDate = toDateKey(log.startDate);
    const endDate = toDateKey(log.endDate);
    return startDate <= todayKey && (!endDate || endDate >= todayKey);
  });
  const upcomingReminderCount = dashboardData?.reminders.filter(
    (reminder) =>
      new Date(reminder.scheduledAt) >= new Date() &&
      !["completed", "cancelled"].includes(reminder.status?.toLowerCase())
  ).length ?? 0;

  return (
    <div className="min-h-screen bg-[#FFF8F3] text-[#542B35] font-sans antialiased selection:bg-[#F4C5CC] selection:text-[#542B35]">
      {/* Background radial ambiance */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-[#EAAEA5]/15 blur-3xl" />
        <div className="absolute top-1/3 left-10 h-96 w-96 rounded-full bg-[#F5D7BB]/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#FCE4E4]/30 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          phaseName={cycleSummary?.phase}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar
            onMenuClick={() => setSidebarOpen(true)}
            onQuickLogClick={scrollToLog}
            onReminderClick={scrollToReminders}
            userName={dashboardData?.profile.name}
            cycleDay={cycleSummary?.cycleDay}
            phaseName={cycleSummary?.phase}
            reminderCount={upcomingReminderCount}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
            {error && (
              <div
                role="alert"
                className="flex flex-col gap-3 rounded-2xl border border-[#F6BFC1] bg-[#FDE8E8] p-4 text-sm text-[#8D2B44] sm:flex-row sm:items-center sm:justify-between"
              >
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    loadDashboardData();
                  }}
                  className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#8D2B44] hover:bg-[#FFF8F3]"
                >
                  Retry
                </button>
              </div>
            )}

            {loading && !dashboardData ? (
              <div className="rounded-3xl border border-[#F0DDD5] bg-white/90 p-8 text-center text-sm text-[#806B68]">
                Loading your cycle data…
              </div>
            ) : !dashboardData ? (
              <div className="rounded-3xl border border-[#F0DDD5] bg-white/90 p-8 text-center text-sm text-[#806B68]">
                Your dashboard data could not be loaded. Check that the backend and database are running, then retry.
              </div>
            ) : (
              <>
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    title="Average Cycle"
                    value={cycleSummary.averageCycleLength
                      ? cycleSummary.averageCycleLength.toFixed(1)
                      : "—"}
                    unit={cycleSummary.averageCycleLength ? "days" : ""}
                    subtitle={
                      cycleSummary.averageCycleSource === "history"
                        ? `From ${dashboardData.insights.cycles.intervalCount} recorded interval(s)`
                        : "Using your saved preference until more cycles are logged"
                    }
                    badge={cycleSummary.averageCycleSource === "history" ? "History" : "Preference"}
                    badgeType="neutral"
                    icon={CycleIcon}
                  />
                  <StatCard
                    title="Average Period"
                    value={cycleSummary.averagePeriodLength
                      ? cycleSummary.averagePeriodLength.toFixed(1)
                      : "—"}
                    unit={cycleSummary.averagePeriodLength ? "days" : ""}
                    subtitle={
                      cycleSummary.averagePeriodSource === "history"
                        ? "Based on completed period logs"
                        : "Using your saved preference"
                    }
                    badge={cycleSummary.averagePeriodSource === "history" ? "History" : "Preference"}
                    badgeType="peach"
                    icon={DropIcon}
                  />
                  <StatCard
                    title="Current Cycle Day"
                    value={cycleSummary.cycleDay ?? "—"}
                    subtitle={
                      cycleSummary.cycleDay
                        ? `${cycleSummary.phase ?? "Cycle phase"} estimate`
                        : "Log a period start to track a cycle"
                    }
                    badge={cycleSummary.phase ? "Estimate" : "No active cycle"}
                    badgeType="rose"
                    icon={SparkleIcon}
                  />
                  <StatCard
                    title="Symptom Logs"
                    value={dashboardData.symptomLogCount}
                    unit="logs"
                    subtitle="Entries saved to your account"
                    badge="Personal"
                    badgeType="berry"
                    icon={HeartIcon}
                  />
                </section>

                {activeTab === "overview" && (
                  <>
                    <section>
                      <CycleOverview
                        cycleDay={cycleSummary.cycleDay}
                        cycleLength={cycleSummary.cycleLength}
                        periodLength={cycleSummary.periodLength}
                        phaseName={cycleSummary.phase}
                        nextPeriodDate={cycleSummary.nextPeriodDate}
                      />
                    </section>

                    <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                      <div ref={logRef} className="lg:col-span-5">
                        <QuickLog
                          symptoms={dashboardData.symptoms}
                          existingLog={currentSymptomLog}
                          periodLog={currentPeriodLog}
                          cycleDay={cycleSummary.cycleDay}
                          onSave={saveDailyEntry}
                          saving={loading}
                        />
                      </div>
                      <div className="lg:col-span-7">
                        <CycleCalendar
                          cycles={dashboardData.cycles}
                          periodLogs={dashboardData.periodLogs}
                          symptomLogs={dashboardData.symptomLogs}
                          nextPeriodDate={cycleSummary.nextPeriodDate}
                        />
                      </div>
                    </section>

                    <section ref={remindersRef}>
                      <UpcomingReminders reminders={dashboardData.reminders} />
                    </section>

                    <section>
                      <Insights
                        view="all"
                        cycles={dashboardData.cycles}
                        insights={dashboardData.insights}
                      />
                    </section>
                  </>
                )}

                {activeTab === "calendar" && (
                  <div className="space-y-8">
                    <CycleCalendar
                      cycles={dashboardData.cycles}
                      periodLogs={dashboardData.periodLogs}
                      symptomLogs={dashboardData.symptomLogs}
                      nextPeriodDate={cycleSummary.nextPeriodDate}
                    />
                    <CycleOverview
                      cycleDay={cycleSummary.cycleDay}
                      cycleLength={cycleSummary.cycleLength}
                      periodLength={cycleSummary.periodLength}
                      phaseName={cycleSummary.phase}
                      nextPeriodDate={cycleSummary.nextPeriodDate}
                    />
                  </div>
                )}

                {activeTab === "log" && (
                  <div className="mx-auto max-w-2xl space-y-8">
                    <QuickLog
                      symptoms={dashboardData.symptoms}
                      existingLog={currentSymptomLog}
                      periodLog={currentPeriodLog}
                      cycleDay={cycleSummary.cycleDay}
                      onSave={saveDailyEntry}
                      saving={loading}
                    />
                  </div>
                )}

                {activeTab === "analytics" && (
                  <Insights
                    view="analytics"
                    cycles={dashboardData.cycles}
                    insights={dashboardData.insights}
                  />
                )}

                {activeTab === "insights" && (
                  <Insights
                    view="library"
                    cycles={dashboardData.cycles}
                    insights={dashboardData.insights}
                  />
                )}
              </>
            )}
          </main>

          <footer className="border-t border-[#F0DDD5] py-6 px-8 text-center text-xs text-[#A18480]">
            <p>Nura Personal Health • Your cycle and symptom records are saved with your account.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
