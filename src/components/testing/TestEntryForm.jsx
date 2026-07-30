import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, FlaskConical } from "lucide-react";
const TESTS = [
  { key: "mile_time_seconds", label: "1 Mile Run", unit: "seconds", placeholder: "e.g. 480", icon: "🏃" },
  { key: "sprint_100m_seconds", label: "100m Sprint", unit: "seconds", placeholder: "e.g. 13.5", icon: "⚡" },
  { key: "broad_jump_cm", label: "Broad Jump", unit: "cm", placeholder: "e.g. 185", icon: "🦘" },
  { key: "vertical_jump_cm", label: "Vertical Jump", unit: "cm", placeholder: "e.g. 55", icon: "📏" },
  { key: "bronco_time_seconds", label: "Bronco Shuttle", unit: "seconds", placeholder: "e.g. 115", icon: "🔄" },
  { key: "beep_test_level", label: "Beep Test Level", unit: "level", placeholder: "e.g. 8.5", icon: "🔊" },
  { key: "pushups", label: "Push-ups (max)", unit: "reps", placeholder: "e.g. 40", icon: "💪" },
  { key: "situps", label: "Sit-ups (60s)", unit: "reps", placeholder: "e.g. 45", icon: "🧘" },
  { key: "flexibility_cm", label: "Sit & Reach", unit: "cm", placeholder: "e.g. 28", icon: "🤸" },
];
export default function TestEntryForm({ onSubmit, isLoading, defaultDate }) {
  const [date, setDate] = useState(defaultDate || new Date().toISOString().split("T")[0]);
  const [values, setValues] = useState({});
  const [notes, setNotes] = useState("");
  const handleChange = (key, val) => setValues(v => ({ ...v, [key]: val ? parseFloat(val) : undefined }));
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { test_date: date, notes };
    Object.entries(values).forEach(([k, v]) => { if (v !== undefined && !isNaN(v)) payload[k] = v; });
    onSubmit(payload);
  };
  const hasValues = Object.values(values).some(v => v !== undefined && v !== "" && !isNaN(v));
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div><label className="text-xs font-semibold text-[#F8F8F8]/40 uppercase tracking-wide mb-1.5 block">Test Date</label><Input type="date" value={date} onChange={e => setDate(e.target.value)} className="rounded-xl max-w-xs" /></div>
      <div>
        <label className="text-xs font-semibold text-[#F8F8F8]/40 uppercase tracking-wide mb-3 block">Test Results</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TESTS.map(t => (
            <div key={t.key} className="bg-[#0A1628] border border-[#2A3F58] rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1.5"><span className="text-base">{t.icon}</span><span className="text-sm font-medium text-[#F8F8F8]/70">{t.label}</span></div>
              <div className="flex items-center gap-2">
                <Input type="number" step="0.01" placeholder={t.placeholder} value={values[t.key] ?? ""} onChange={e => handleChange(t.key, e.target.value)} className="rounded-lg text-sm h-8" />
                <span className="text-xs text-[#F8F8F8]/30 whitespace-nowrap">{t.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div><label className="text-xs font-semibold text-[#F8F8F8]/40 uppercase tracking-wide mb-1.5 block">Notes (optional)</label><Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Conditions, observations..." className="rounded-xl" /></div>
      <Button type="submit" disabled={!hasValues || isLoading} className="bg-[#B8960C] text-[#0A1628] hover:bg-[#D4AA10] rounded-xl px-8">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FlaskConical className="w-4 h-4 mr-2" />}Save Test Results
      </Button>
    </form>
  );
}
