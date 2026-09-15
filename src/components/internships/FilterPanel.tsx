"use client";

import React from "react";
import { Filter, RotateCcw, MapPin, Sparkles } from "lucide-react";

export interface FilterState {
  workMode?: "REMOTE" | "HYBRID" | "ONSITE" | "";
  location?: string;
  minStipend?: number | "";
  skills?: string;
  sort?: "recent" | "deadline" | "stipend";
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

const POPULAR_SKILLS = [
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "Go",
  "Next.js",
  "PostgreSQL",
  "Docker",
  "AWS",
  "Kubernetes",
  "AI/ML",
  "Kafka",
];

const INDIAN_HUBS = [
  "Bengaluru",
  "Gurugram",
  "Noida",
  "Delhi",
  "Hyderabad",
  "Pune",
  "Mumbai",
  "Chennai",
  "Remote (India)",
];

export function FilterPanel({ filters, onChange, onReset }: FilterPanelProps) {
  const handleWorkModeChange = (mode: "REMOTE" | "HYBRID" | "ONSITE" | "") => {
    onChange({
      ...filters,
      workMode: filters.workMode === mode ? "" : mode,
    });
  };

  const handleSkillToggle = (skill: string) => {
    const currentSkills = filters.skills
      ? filters.skills.split(",").map((s) => s.trim())
      : [];
    let updated: string[];
    if (currentSkills.includes(skill)) {
      updated = currentSkills.filter((s) => s !== skill);
    } else {
      updated = [...currentSkills, skill];
    }
    onChange({
      ...filters,
      skills: updated.join(","),
    });
  };

  const handleLocationPreset = (loc: string) => {
    if (filters.location?.toLowerCase().includes(loc.toLowerCase().slice(0, 5))) {
      onChange({ ...filters, location: "" });
    } else {
      onChange({ ...filters, location: loc });
    }
  };

  const currentSkillArray = filters.skills
    ? filters.skills.split(",").map((s) => s.trim())
    : [];

  const hasActiveFilters =
    Boolean(filters.workMode) ||
    Boolean(filters.location) ||
    Boolean(filters.minStipend) ||
    Boolean(filters.skills);

  return (
    <div
      className="rounded-2xl p-5 space-y-6"
      style={{
        background: "rgba(15,23,42,0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 24px -4px rgba(0,0,0,0.4)",
      }}
    >
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Filter className="w-4 h-4 text-blue-400" />
          <span>Filter Internships</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All
          </button>
        )}
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={filters.sort || "recent"}
          onChange={(e) =>
            onChange({
              ...filters,
              sort: e.target.value as "recent" | "deadline" | "stipend",
            })
          }
          className="w-full text-xs rounded-xl border border-white/[0.1] py-2.5 px-3 text-white bg-slate-900/80 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
        >
          <option value="recent" style={{ background: "#0f172a" }}>Most Recent Postings</option>
          <option value="deadline" style={{ background: "#0f172a" }}>Closing Soonest</option>
          <option value="stipend" style={{ background: "#0f172a" }}>Highest Stipend</option>
        </select>
      </div>

      {/* Work Mode */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Work Mode
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(["REMOTE", "HYBRID", "ONSITE"] as const).map((mode) => {
            const active = filters.workMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => handleWorkModeChange(mode)}
                className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all text-center cursor-pointer ${
                  active
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25"
                    : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                {mode === "REMOTE"
                  ? "Remote"
                  : mode === "HYBRID"
                  ? "Hybrid"
                  : "On-site"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location Search & Indian Hubs */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Location / Tech Hub
        </label>
        <input
          type="text"
          value={filters.location || ""}
          placeholder="e.g. Bengaluru, Gurugram, Delhi..."
          onChange={(e) =>
            onChange({
              ...filters,
              location: e.target.value,
            })
          }
          className="w-full text-xs rounded-xl border border-white/[0.1] py-2.5 px-3 text-white bg-slate-900/80 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 mb-2.5"
        />

        {/* Indian Tech Hub quick chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-500 block">
            Popular Indian Tech Hubs:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {INDIAN_HUBS.map((hub) => {
              const isSelected = filters.location?.toLowerCase().includes(hub.toLowerCase());
              return (
                <button
                  key={hub}
                  type="button"
                  onClick={() => handleLocationPreset(hub)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-500/20 border-blue-500/50 text-blue-300 font-bold shadow-xs"
                      : "bg-white/[0.04] border-white/[0.07] text-slate-400 hover:border-white/[0.15] hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  📍 {hub}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Minimum Monthly Stipend */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Minimum Stipend
        </label>
        <select
          value={filters.minStipend || ""}
          onChange={(e) =>
            onChange({
              ...filters,
              minStipend: e.target.value ? Number(e.target.value) : "",
            })
          }
          className="w-full text-xs rounded-xl border border-white/[0.1] py-2.5 px-3 text-white bg-slate-900/80 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
        >
          <option value="" style={{ background: "#0f172a" }}>Any Stipend</option>
          <option value="25000" style={{ background: "#0f172a" }}>₹25,000+ / month</option>
          <option value="40000" style={{ background: "#0f172a" }}>₹40,000+ / month</option>
          <option value="50000" style={{ background: "#0f172a" }}>₹50,000+ / month</option>
          <option value="60000" style={{ background: "#0f172a" }}>₹60,000+ / month</option>
          <option value="75000" style={{ background: "#0f172a" }}>₹75,000+ / month (High Tier)</option>
        </select>
      </div>

      {/* Popular Skills */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Tech Stack & Skills
        </label>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SKILLS.map((skill) => {
            const isSelected = currentSkillArray.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillToggle(skill)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-xs"
                    : "bg-white/[0.04] border-white/[0.07] text-slate-400 hover:border-white/[0.15] hover:text-slate-200 hover:bg-white/[0.08]"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
