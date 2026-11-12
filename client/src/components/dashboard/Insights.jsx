import { useState } from "react";

export default function Insights({ view = "all" }) {
  const [bookmarkedArticles, setBookmarkedArticles] = useState([1, 2]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleBookmark = (id) => {
    if (bookmarkedArticles.includes(id)) {
      setBookmarkedArticles(bookmarkedArticles.filter((item) => item !== id));
    } else {
      setBookmarkedArticles([...bookmarkedArticles, id]);
    }
  };

  const cycleHistory = [
    { month: "May", days: 28, status: "Regular" },
    { month: "Jun", days: 29, status: "Regular" },
    { month: "Jul", days: 28, status: "Regular" },
    { month: "Aug", days: 27, status: "Regular" },
    { month: "Sep", days: 28, status: "Regular" },
    { month: "Oct", days: 28, status: "Regular" },
  ];

  const symptomFrequency = [
    { name: "Radiant & High Energy", percentage: 86, color: "bg-[#E77D91]", phase: "Ovulatory" },
    { name: "Clear Skin & Glow", percentage: 78, color: "bg-[#EBC9A9]", phase: "Follicular" },
    { name: "Breast Tenderness", percentage: 32, color: "bg-[#C94F6C]", phase: "Luteal" },
    { name: "Pelvic Cramping", percentage: 24, color: "bg-[#A83D55]", phase: "Menstrual" },
    { name: "Sweet Cravings", percentage: 19, color: "bg-[#7E3B4D]", phase: "Late Luteal" },
  ];

  const allArticles = [
    {
      id: 1,
      title: "The Four Inner Seasons: Aligning Work & Rest With Your Cycle",
      category: "Cycle Wisdom",
      readTime: "5 min read",
      author: "Dr. Camille Vance, OB/GYN",
      excerpt:
        "Learn how to schedule deep focus, creative brainstorming, and restorative downtime in harmony with your natural hormonal shifts.",
      keyTakeaway: "Sync high-stake meetings with your ovulatory surge.",
    },
    {
      id: 2,
      title: "Nourishing Your Luteal Phase: Magnesium & Healthy Fats",
      category: "Holistic Nutrition",
      readTime: "4 min read",
      author: "Maya Lindqvist, M.S. RD",
      excerpt:
        "Support natural progesterone production and minimize pre-menstrual water retention with grounding, mineral-rich whole foods.",
      keyTakeaway: "Roasted root vegetables and pumpkin seeds reduce bloating.",
    },
    {
      id: 3,
      title: "Decoding Basal Body Temp & Cervical Fluid Biomarkers",
      category: "Body Literacy",
      readTime: "6 min read",
      author: "Nura Medical Advisory",
      excerpt:
        "Understanding your body's subtle daily signs gives you true autonomy over fertility, cycle health, and hormonal equilibrium.",
      keyTakeaway: "A 0.3°F sustained temperature shift confirms ovulation.",
    },
    {
      id: 4,
      title: "Seed Cycling for Hormone Balance: Fact vs. Myth",
      category: "Holistic Nutrition",
      readTime: "4 min read",
      author: "Maya Lindqvist, M.S. RD",
      excerpt:
        "A scientific breakdown of pumpkin, flax, sesame, and sunflower seeds for supporting estrogen and progesterone regulation.",
      keyTakeaway: "Flax and pumpkin for days 1–14; sesame and sunflower for days 15–28.",
    },
    {
      id: 5,
      title: "Rest as a Biological Necessity During Menstruation",
      category: "Cycle Wisdom",
      readTime: "3 min read",
      author: "Elena Rostova",
      excerpt:
        "Why lowering cortisol during Days 1 to 3 sets the neurochemical foundation for a calmer, more productive upcoming cycle.",
      keyTakeaway: "Deep sleep in menses protects cellular resilience.",
    },
    {
      id: 6,
      title: "The Brain on Estrogen: Cognitive Clarity in the Follicular Phase",
      category: "Body Literacy",
      readTime: "5 min read",
      author: "Dr. Camille Vance, OB/GYN",
      excerpt:
        "How surging estradiol enhances neuroplasticity, verbal memory, and spatial problem-solving right before ovulation.",
      keyTakeaway: "Tackle your most complex analytical tasks around Days 9–13.",
    },
  ];

  const filteredArticles = allArticles.filter((art) => {
    const matchesCategory =
      selectedCategory === "All"
        ? true
        : selectedCategory === "Bookmarked"
        ? bookmarkedArticles.includes(art.id)
        : art.category === selectedCategory;

    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const showAnalytics = view === "all" || view === "analytics";
  const showLibrary = view === "all" || view === "library" || view === "insights";

  return (
    <div className="space-y-8">
      {/* 1. Analytics & Trends Card */}
      {showAnalytics && (
        <div className="rounded-3xl border border-[#F0DDD5] bg-white/95 p-6 shadow-[0_4px_25px_rgba(84,43,53,0.04)] backdrop-blur-sm lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#F7EDE8] pb-4 gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A83D55]">
                {view === "analytics" ? "Detailed Diagnostic View" : "Health Trends"}
              </span>
              <h2 className="font-serif text-2xl font-semibold text-[#542B35]">
                Hormone & Symptom Analytics
              </h2>
              <p className="text-xs text-[#806B68]">
                Continuous biological modeling based on your past 6 menstrual cycles
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#F0DDD5] bg-[#FFF8F3] px-3.5 py-1.5 text-xs text-[#542B35]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">98.5% Cycle Consistency</span>
            </div>
          </div>

          {/* Quick Metrics Banner (if dedicated analytics view) */}
          {view === "analytics" && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-[#F0DDD5] bg-[#FFF8F3] p-4 text-center">
                <span className="text-[11px] text-[#806B68] uppercase font-semibold">Mean Cycle</span>
                <p className="font-serif text-2xl font-bold text-[#542B35] mt-1">28.0 days</p>
                <span className="text-[10px] text-emerald-600 font-medium">± 0.5d variance</span>
              </div>
              <div className="rounded-2xl border border-[#F0DDD5] bg-[#FFF8F3] p-4 text-center">
                <span className="text-[11px] text-[#806B68] uppercase font-semibold">Estrogen Peak</span>
                <p className="font-serif text-2xl font-bold text-[#C94F6C] mt-1">Day 13.5</p>
                <span className="text-[10px] text-[#806B68]">Pre-ovulatory surge</span>
              </div>
              <div className="rounded-2xl border border-[#F0DDD5] bg-[#FFF8F3] p-4 text-center">
                <span className="text-[11px] text-[#806B68] uppercase font-semibold">Progesterone</span>
                <p className="font-serif text-2xl font-bold text-[#542B35] mt-1">Day 21</p>
                <span className="text-[10px] text-[#806B68]">Luteal plateau</span>
              </div>
              <div className="rounded-2xl border border-[#F0DDD5] bg-[#FFF8F3] p-4 text-center">
                <span className="text-[11px] text-[#806B68] uppercase font-semibold">Fertile Window</span>
                <p className="font-serif text-2xl font-bold text-[#A83D55] mt-1">6 days</p>
                <span className="text-[10px] text-[#806B68]">Days 11–16</span>
              </div>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Historical Cycle Duration Bar Chart (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#947875]">
                  Cycle Length Stability (Last 6 Months)
                </h3>
                <span className="text-[11px] text-[#A83D55] font-medium">Target: 28d</span>
              </div>

              <div className="flex items-end justify-between gap-2 h-48 rounded-2xl border border-[#F5E1DB] bg-[#FFF8F3]/60 p-4">
                {cycleHistory.map((item) => (
                  <div key={item.month} className="flex flex-col items-center flex-1 h-full justify-end">
                    <span className="text-[11px] font-semibold text-[#542B35] mb-1">
                      {item.days}d
                    </span>
                    <div
                      className="w-full max-w-[38px] rounded-t-xl bg-gradient-to-t from-[#C94F6C] to-[#E77D91] transition-all hover:opacity-85 shadow-2xs"
                      style={{ height: `${(item.days / 32) * 100}%` }}
                    />
                    <span className="mt-2 text-[11px] font-medium text-[#806B68]">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-[#806B68] text-center">
                Cycle deviation is within optimal medical thresholds (<strong className="text-[#542B35]">± 1.2 days</strong>).
              </p>
            </div>

            {/* Symptom Frequency Breakdown (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#947875]">
                  Sensation & Symptom Frequencies
                </h3>
                <span className="text-[11px] text-[#806B68]">Correlated Phase</span>
              </div>

              <div className="space-y-3.5 rounded-2xl border border-[#F5E1DB] bg-[#FFF8F3]/60 p-4">
                {symptomFrequency.map((sym) => (
                  <div key={sym.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#542B35]">{sym.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#A18480] bg-white px-2 py-0.5 rounded-full border border-[#F0DDD5]">
                          {sym.phase}
                        </span>
                        <span className="font-semibold text-[#542B35] w-8 text-right">{sym.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#F0DDD5]">
                      <div
                        className={`h-full rounded-full ${sym.color} transition-all duration-500`}
                        style={{ width: `${sym.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hormone Curve SVG Preview */}
          <div className="mt-8 rounded-2xl border border-[#F5E1DB] bg-gradient-to-br from-[#FFFDFB] to-[#FFF6F2] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#947875]">
                  Theoretical 28-Day Hormone Rhythm
                </p>
                <p className="text-xs text-[#806B68]">Continuous tracking of Estradiol (E2) and Progesterone (P4)</p>
              </div>
              <div className="flex items-center gap-5 text-xs">
                <span className="flex items-center gap-1.5 text-[#C94F6C] font-semibold">
                  <span className="h-2.5 w-5 rounded-full bg-[#C94F6C]" />
                  Estrogen (Surges Pre-Ovulation)
                </span>
                <span className="flex items-center gap-1.5 text-[#542B35] font-semibold">
                  <span className="h-2.5 w-5 rounded-full bg-[#542B35]" />
                  Progesterone (Dominates Luteal)
                </span>
              </div>
            </div>

            {/* Smooth SVG Hormone Curve */}
            <div className="h-32 w-full overflow-hidden">
              <svg viewBox="0 0 500 100" preserveAspectRatio="none" className="w-full h-full">
                {/* Horizontal reference lines */}
                <line x1="0" y1="25" x2="500" y2="25" stroke="#F5E1DB" strokeDasharray="3 3" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="#F5E1DB" strokeDasharray="3 3" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#F5E1DB" strokeDasharray="3 3" />

                {/* Day 14 vertical marker */}
                <line x1="250" y1="0" x2="250" y2="100" stroke="#A83D55" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
                <text x="254" y="16" fill="#A83D55" fontSize="10" fontWeight="600">Day 14 (Today • Peak LH)</text>

                {/* Estrogen Curve */}
                <path
                  d="M 0,85 Q 120,80 180,60 T 240,15 T 280,65 T 380,45 T 500,90"
                  fill="none"
                  stroke="#C94F6C"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Progesterone Curve */}
                <path
                  d="M 0,92 L 230,90 Q 280,85 320,40 T 400,20 T 460,75 L 500,92"
                  fill="none"
                  stroke="#542B35"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex justify-between text-[11px] font-medium text-[#A18480] pt-2 border-t border-[#F5E1DB] mt-2">
              <span>Day 1 (Menses)</span>
              <span>Day 7 (Follicular)</span>
              <span>Day 14 (Ovulation)</span>
              <span>Day 21 (Mid-Luteal)</span>
              <span>Day 28 (Cycle End)</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Educational Health Articles */}
      {showLibrary && (
        <div className="rounded-3xl border border-[#F0DDD5] bg-white/95 p-6 shadow-[0_4px_25px_rgba(84,43,53,0.04)] backdrop-blur-sm lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#F7EDE8] pb-6 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A83D55]">
                Educational Library
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#542B35]">
                Cycle Wisdom & Health Library
              </h2>
              <p className="text-xs sm:text-sm text-[#806B68]">
                Evidence-backed guides curated for every phase of your hormonal cycle
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search articles or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-[#F0DDD5] bg-[#FFF8F3] px-4 py-2 text-xs text-[#542B35] placeholder-[#A18480] focus:border-[#C94F6C] focus:outline-none"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-[#A18480]">🔍</span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {["All", "Cycle Wisdom", "Holistic Nutrition", "Body Literacy", "Bookmarked"].map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-[#C94F6C] text-white shadow-xs"
                      : "bg-[#FFF8F3] text-[#806B68] border border-[#F0DDD5] hover:border-[#E8C7BC] hover:text-[#542B35]"
                  }`}
                >
                  {cat === "Bookmarked" ? `★ ${cat} (${bookmarkedArticles.length})` : cat}
                </button>
              );
            })}
          </div>

          {/* Articles Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.length === 0 ? (
              <div className="col-span-full py-12 text-center text-sm text-[#806B68]">
                No articles found matching your criteria. Try another search or filter!
              </div>
            ) : (
              filteredArticles.map((art) => {
                const isBookmarked = bookmarkedArticles.includes(art.id);
                return (
                  <div
                    key={art.id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-[#F0DDD5] bg-white p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:border-[#E8C7BC]"
                  >
                    <div>
                      {/* Category & Bookmark */}
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-[#FCE4E4] px-2.5 py-0.5 text-[11px] font-semibold text-[#A83D55]">
                          {art.category}
                        </span>
                        <button
                          onClick={() => toggleBookmark(art.id)}
                          className="rounded-full p-1.5 text-[#A18480] hover:bg-[#FAF0EA] hover:text-[#542B35] transition"
                          aria-label="Bookmark article"
                        >
                          <svg
                            className={`h-4 w-4 ${isBookmarked ? "fill-[#C94F6C] text-[#C94F6C]" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.8}
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                          </svg>
                        </button>
                      </div>

                      <h3 className="mt-3 font-serif text-base font-semibold leading-snug text-[#542B35] group-hover:text-[#C94F6C] transition-colors">
                        {art.title}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-[#806B68]">
                        {art.excerpt}
                      </p>

                      {art.keyTakeaway && (
                        <div className="mt-3 rounded-xl bg-[#FFF8F3] border border-[#F5E1DB] p-2.5 text-[11px] text-[#542B35]">
                          <strong className="text-[#A83D55]">Key takeaway: </strong>
                          {art.keyTakeaway}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 border-t border-[#F7EDE8] pt-3 flex items-center justify-between text-[11px] text-[#A18480]">
                      <span>{art.readTime} • {art.author}</span>
                      <span className="font-semibold text-[#C94F6C] group-hover:underline">
                        Read Story →
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
