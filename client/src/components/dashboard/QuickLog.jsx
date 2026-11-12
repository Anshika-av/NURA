import { useState } from "react";

export default function QuickLog() {
  const [selectedFlow, setSelectedFlow] = useState("None");
  const [selectedMoods, setSelectedMoods] = useState(["Radiant", "Energetic"]);
  const [selectedSymptoms, setSelectedSymptoms] = useState(["Clear Skin"]);
  const [cervicalFluid, setCervicalFluid] = useState("Egg White (Fertile)");
  const [bbt, setBbt] = useState("98.3");
  const [notes, setNotes] = useState("Feeling strong, hydrated, and focused for creative work today.");
  const [savedStatus, setSavedStatus] = useState(false);

  const flowOptions = [
    { label: "None", icon: "✨" },
    { label: "Spotting", icon: "💧" },
    { label: "Light", icon: "🩸" },
    { label: "Medium", icon: "🩸🩸" },
    { label: "Heavy", icon: "🩸🩸🩸" },
  ];

  const moodOptions = [
    { label: "Radiant", emoji: "🌸" },
    { label: "Calm", emoji: "🌿" },
    { label: "Energetic", emoji: "⚡" },
    { label: "Focused", emoji: "🎯" },
    { label: "Sensitive", emoji: "🫧" },
    { label: "Anxious", emoji: "☁️" },
    { label: "Fatigued", emoji: "🌙" },
  ];

  const symptomOptions = [
    "Clear Skin",
    "High Libido",
    "Mild Cramps",
    "Tender Breasts",
    "Bloating",
    "Headache",
    "Backache",
    "Sweet Cravings",
    "Restful Sleep",
  ];

  const fluidOptions = [
    "Dry",
    "Sticky",
    "Creamy",
    "Watery",
    "Egg White (Fertile)",
  ];

  const toggleMood = (mood) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter((m) => m !== mood));
    } else {
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  const toggleSymptom = (sym) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedStatus(true);
    setTimeout(() => {
      setSavedStatus(false);
    }, 3000);
  };

  return (
    <div className="rounded-3xl border border-[#F0DDD5] bg-white/95 p-6 shadow-[0_4px_25px_rgba(84,43,53,0.04)] backdrop-blur-sm lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F7EDE8] pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A83D55]">
            Daily Self-Check
          </span>
          <h2 className="font-serif text-2xl font-semibold text-[#542B35]">
            Log Mood & Symptoms
          </h2>
          <p className="text-xs text-[#806B68]">
            Today • Nov 12 • Day 14
          </p>
        </div>

        {savedStatus && (
          <span className="flex items-center gap-1.5 rounded-full bg-[#E6F4EA] px-3 py-1 text-xs font-semibold text-[#2D6A4F] animate-fade-in">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="mt-6 space-y-6">
        {/* Flow Intensity */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#947875]">
            Menstrual Flow
          </label>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {flowOptions.map((opt) => {
              const isSelected = selectedFlow === opt.label;
              return (
                <button
                  type="button"
                  key={opt.label}
                  onClick={() => setSelectedFlow(opt.label)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-[#C94F6C] text-white shadow-xs"
                      : "bg-[#FFF8F3] text-[#806B68] border border-[#F0DDD5] hover:border-[#E8C7BC]"
                  }`}
                >
                  <span className="text-xs">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mood Tracker */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#947875]">
            Emotional State & Mood
          </label>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {moodOptions.map((opt) => {
              const isSelected = selectedMoods.includes(opt.label);
              return (
                <button
                  type="button"
                  key={opt.label}
                  onClick={() => toggleMood(opt.label)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-[#FCE4E4] text-[#A83D55] border border-[#F6BFC1] font-semibold shadow-xs"
                      : "bg-[#FFF8F3] text-[#806B68] border border-[#F0DDD5] hover:border-[#E8C7BC]"
                  }`}
                >
                  <span>{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Physical Symptoms */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#947875]">
            Physical Sensations
          </label>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {symptomOptions.map((sym) => {
              const isSelected = selectedSymptoms.includes(sym);
              return (
                <button
                  type="button"
                  key={sym}
                  onClick={() => toggleSymptom(sym)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-[#542B35] text-white shadow-xs"
                      : "bg-[#FFF8F3] text-[#806B68] border border-[#F0DDD5] hover:border-[#E8C7BC]"
                  }`}
                >
                  {sym}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cervical Fluid & BBT Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#947875]">
              Cervical Fluid
            </label>
            <select
              value={cervicalFluid}
              onChange={(e) => setCervicalFluid(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#F0DDD5] bg-[#FFF8F3] px-3 py-2 text-xs text-[#542B35] focus:border-[#C94F6C] focus:outline-none"
            >
              {fluidOptions.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#947875]">
              Basal Body Temp (°F)
            </label>
            <input
              type="text"
              value={bbt}
              onChange={(e) => setBbt(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#F0DDD5] bg-[#FFF8F3] px-3 py-2 text-xs text-[#542B35] focus:border-[#C94F6C] focus:outline-none"
              placeholder="e.g. 98.4"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#947875]">
            Journal / Body Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#F0DDD5] bg-[#FFF8F3] p-3 text-xs text-[#542B35] focus:border-[#C94F6C] focus:outline-none"
            placeholder="How does your body feel today?"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-xl bg-[#C94F6C] py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-[#C94F6C]/20 transition-all hover:bg-[#AA3D59] hover:shadow-lg active:scale-[0.99]"
        >
          {savedStatus ? "✓ Daily Log Recorded" : "Save Today's Log"}
        </button>
      </form>
    </div>
  );
}
