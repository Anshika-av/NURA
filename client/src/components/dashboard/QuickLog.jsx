import { useMemo, useState } from "react";
import { formatDate, getLocalDateKey } from "../../utils/cycleData.js";

const flowOptions = [
  { label: "None", value: "" },
  { label: "Spotting", value: "spotting" },
  { label: "Light", value: "light" },
  { label: "Medium", value: "medium" },
  { label: "Heavy", value: "heavy" },
];

const moodOptions = [
  "Calm",
  "Energetic",
  "Focused",
  "Anxious",
  "Fatigued",
  "Sensitive",
  "Radiant",
];

const severityOptions = ["mild", "moderate", "severe"];

export default function QuickLog({
  symptoms,
  existingLog,
  periodLog,
  cycleDay,
  onSave,
  saving,
}) {
  const [selectedFlow, setSelectedFlow] = useState(periodLog?.flowIntensity ?? "");
  const [selectedMood, setSelectedMood] = useState(existingLog?.mood ?? "");
  const [selectedSymptoms, setSelectedSymptoms] = useState(
    existingLog?.items.map((item) => item.symptom.id) ?? []
  );
  const [severityById, setSeverityById] = useState(
    Object.fromEntries(
      (existingLog?.items ?? []).map((item) => [
        item.symptom.id,
        item.severity,
      ])
    )
  );
  const [notes, setNotes] = useState(existingLog?.notes ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedStatus, setSavedStatus] = useState(false);
  const today = getLocalDateKey();

  const symptomsById = useMemo(
    () => new Map(symptoms.map((symptom) => [symptom.id, symptom])),
    [symptoms]
  );

  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms((current) =>
      current.includes(symptomId)
        ? current.filter((id) => id !== symptomId)
        : [...current, symptomId]
    );
    setError("");
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError("");
    setSavedStatus(false);

    const items = selectedSymptoms.map((id) => {
      const symptom = symptomsById.get(id);
      return symptom
        ? {
            name: symptom.name,
            category: symptom.category,
            severity: severityById[id],
          }
        : null;
    }).filter(Boolean);

    if (items.some((item) => !severityOptions.includes(item.severity))) {
      setError("Choose a severity for each selected symptom.");
      return;
    }

    if (
      !selectedMood &&
      !notes.trim() &&
      items.length === 0 &&
      !selectedFlow
    ) {
      setError("Add a mood, symptom, note, or period-flow entry before saving.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        date: today,
        mood: selectedMood,
        notes,
        items,
        flowIntensity: selectedFlow || null,
      });
      setSavedStatus(true);
    } catch (saveError) {
      setError(saveError.message || "Your log could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  const disabled = saving || isSaving;

  return (
    <div className="rounded-3xl border border-[#F0DDD5] bg-white/95 p-6 shadow-[0_4px_25px_rgba(84,43,53,0.04)] backdrop-blur-sm lg:p-8">
      <div className="flex items-center justify-between border-b border-[#F7EDE8] pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A83D55]">
            Daily Self-Check
          </span>
          <h2 className="font-serif text-2xl font-semibold text-[#542B35]">
            Log Mood & Symptoms
          </h2>
          <p className="text-xs text-[#806B68]">
            {formatDate(today, { weekday: "long", month: "short", day: "numeric" })}
            {cycleDay ? ` · Estimated cycle day ${cycleDay}` : ""}
          </p>
        </div>

        {savedStatus && (
          <span role="status" className="rounded-full bg-[#E6F4EA] px-3 py-1 text-xs font-semibold text-[#2D6A4F]">
            Saved to your account
          </span>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-[#FDE8E8] p-3 text-xs text-[#8D2B44]">
          {error}
        </p>
      )}

      <form onSubmit={handleSave} className="mt-6 space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#947875]">
            Menstrual Flow
          </label>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {flowOptions.map((option) => (
              <button
                type="button"
                key={option.value || "none"}
                aria-pressed={selectedFlow === option.value}
                onClick={() => {
                  setSelectedFlow(option.value);
                  setError("");
                }}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                  selectedFlow === option.value
                    ? "border-[#C94F6C] bg-[#C94F6C] text-white"
                    : "border-[#F0DDD5] bg-[#FFF8F3] text-[#806B68] hover:border-[#E8C7BC]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <fieldset>
          <legend className="block text-xs font-semibold uppercase tracking-wider text-[#947875]">
            Mood
          </legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {moodOptions.map((mood) => (
              <button
                type="button"
                key={mood}
                aria-pressed={selectedMood === mood}
                onClick={() => {
                  setSelectedMood(selectedMood === mood ? "" : mood);
                  setError("");
                }}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                  selectedMood === mood
                    ? "border-[#F6BFC1] bg-[#FCE4E4] font-semibold text-[#A83D55]"
                    : "border-[#F0DDD5] bg-[#FFF8F3] text-[#806B68] hover:border-[#E8C7BC]"
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="block text-xs font-semibold uppercase tracking-wider text-[#947875]">
            Symptoms
          </legend>
          {symptoms.length === 0 ? (
            <p className="mt-2 text-xs text-[#806B68]">
              No symptoms are available yet. Try again after the symptom catalogue is seeded.
            </p>
          ) : (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {symptoms.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom.id);
                return (
                  <button
                    type="button"
                    key={symptom.id}
                    aria-pressed={isSelected}
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? "border-[#542B35] bg-[#542B35] text-white"
                        : "border-[#F0DDD5] bg-[#FFF8F3] text-[#806B68] hover:border-[#E8C7BC]"
                    }`}
                  >
                    {symptom.name}
                  </button>
                );
              })}
            </div>
          )}

          {selectedSymptoms.length > 0 && (
            <div className="mt-4 space-y-3">
              {selectedSymptoms.map((id) => {
                const symptom = symptomsById.get(id);
                if (!symptom) return null;
                return (
                  <label
                    key={id}
                    className="flex items-center justify-between gap-3 text-xs text-[#542B35]"
                  >
                    <span>{symptom.name} severity</span>
                    <select
                      value={severityById[id] ?? ""}
                      onChange={(event) => {
                        setSeverityById((current) => ({
                          ...current,
                          [id]: event.target.value,
                        }));
                        setError("");
                      }}
                      className="rounded-lg border border-[#F0DDD5] bg-[#FFF8F3] px-3 py-2 text-xs capitalize focus:border-[#C94F6C] focus:outline-none"
                    >
                      <option value="" disabled>
                        Select severity
                      </option>
                      {severityOptions.map((severity) => (
                        <option key={severity} value={severity}>
                          {severity}
                        </option>
                      ))}
                    </select>
                  </label>
                );
              })}
            </div>
          )}
        </fieldset>

        <div>
          <label
            htmlFor="daily-notes"
            className="block text-xs font-semibold uppercase tracking-wider text-[#947875]"
          >
            Notes
          </label>
          <textarea
            id="daily-notes"
            rows={3}
            maxLength={5000}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[#F0DDD5] bg-[#FFF8F3] p-3 text-xs text-[#542B35] focus:border-[#C94F6C] focus:outline-none"
            placeholder="Add an optional note about how you feel today."
          />
        </div>

        <button
          type="submit"
          disabled={disabled}
          className="w-full rounded-xl bg-[#C94F6C] py-3 text-xs font-semibold text-white shadow-md shadow-[#C94F6C]/20 transition-all hover:bg-[#AA3D59] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
        >
          {disabled ? "Saving…" : "Save Today's Log"}
        </button>
      </form>
    </div>
  );
}
