"use client";

import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
  "TypeScript",
  "React",
  "Python",
  "Go",
  "PostgreSQL",
  "Docker",
  "AWS",
  "AI/ML",
  "Figma",
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

  const currentSkillArray = filters.skills
    ? filters.skills.split(",").map((s) => s.trim())
    : [];

  const hasActiveFilters =
    Boolean(filters.workMode) ||
    Boolean(filters.location) ||
    Boolean(filters.minStipend) ||
    Boolean(filters.skills);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filter Internships</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
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
          className="w-full text-xs rounded-lg border border-slate-200 py-2 px-2.5 text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="recent">Most Recent</option>
          <option value="deadline">Closing Soonest</option>
          <option value="stipend">Highest Stipend</option>
        </select>
      </div>

      {/* Work Mode */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
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
                className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-all text-center ${
                  active
                    ? "bg-blue-50 border-blue-600 text-blue-700 font-semibold"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
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

      {/* Minimum Monthly Stipend */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
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
          className="w-full text-xs rounded-lg border border-slate-200 py-2 px-2.5 text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any Stipend (Including Unpaid)</option>
          <option value="1000">$1,000+ / month</option>
          <option value="2000">$2,000+ / month</option>
          <option value="3000">$3,000+ / month</option>
        </select>
      </div>

      {/* Location Search */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Location
        </label>
        <input
          type="text"
          value={filters.location || ""}
          placeholder="e.g. San Francisco, Boston..."
          onChange={(e) =>
            onChange({
              ...filters,
              location: e.target.value,
            })
          }
          className="w-full text-xs rounded-lg border border-slate-200 py-2 px-2.5 text-slate-800 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Popular Skills */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Required Skills
        </label>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SKILLS.map((skill) => {
            const isSelected = currentSkillArray.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillToggle(skill)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white font-medium shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
