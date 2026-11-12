import { useState, useRef } from "react";
import Sidebar from "../components/dashboard/Sidebar.jsx";
import Topbar from "../components/dashboard/Topbar.jsx";
import StatCard from "../components/dashboard/StatCard.jsx";
import CycleOverview from "../components/dashboard/CycleOverview.jsx";
import QuickLog from "../components/dashboard/QuickLog.jsx";
import CycleCalendar from "../components/dashboard/CycleCalendar.jsx";
import Insights from "../components/dashboard/Insights.jsx";

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

  const logRef = useRef(null);

  const scrollToLog = () => {
    setActiveTab("overview");
    if (logRef.current) {
      logRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar
            onMenuClick={() => setSidebarOpen(true)}
            onQuickLogClick={scrollToLog}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
            {/* Stat Cards Row */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Average Cycle"
                value="28"
                unit="days"
                subtitle="Typical range: 27–29 days"
                badge="Regular"
                badgeType="success"
                icon={CycleIcon}
              />
              <StatCard
                title="Period Duration"
                value="5"
                unit="days"
                subtitle="Consistent medium-light flow"
                badge="Normal"
                badgeType="peach"
                icon={DropIcon}
              />
              <StatCard
                title="Current Phase"
                value="Day 14"
                unit=""
                subtitle="Peak Ovulation Window"
                badge="Fertile"
                badgeType="rose"
                icon={SparkleIcon}
              />
              <StatCard
                title="Cycle Regularity"
                value="98.5%"
                unit=""
                subtitle="Last 6 cycles analyzed"
                badge="Optimal"
                badgeType="berry"
                icon={HeartIcon}
              />
            </section>

            {/* Tab based / Complete Dashboard content */}
            {activeTab === "overview" && (
              <>
                {/* Hero Cycle Overview */}
                <section>
                  <CycleOverview />
                </section>

                {/* Grid: Quick Log & Calendar */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div ref={logRef} className="lg:col-span-5">
                    <QuickLog />
                  </div>
                  <div className="lg:col-span-7">
                    <CycleCalendar />
                  </div>
                </section>

                {/* Insights, Trends & Health Articles */}
                <section>
                  <Insights view="all" />
                </section>
              </>
            )}

            {activeTab === "calendar" && (
              <div className="space-y-8">
                <CycleCalendar />
                <CycleOverview />
              </div>
            )}

            {activeTab === "log" && (
              <div className="max-w-2xl mx-auto space-y-8">
                <QuickLog />
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-8">
                <Insights view="analytics" />
              </div>
            )}

            {activeTab === "insights" && (
              <div className="space-y-8">
                <Insights view="library" />
              </div>
            )}
          </main>

          {/* Minimalist Dashboard Footer */}
          <footer className="border-t border-[#F0DDD5] py-6 px-8 text-center text-xs text-[#A18480]">
            <p>Nura Personal Health • All health data is encrypted and stored locally on your device.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
