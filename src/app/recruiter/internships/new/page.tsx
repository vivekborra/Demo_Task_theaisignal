"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import {
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  Briefcase,
  ListChecks,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function NewInternshipPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState<"REMOTE" | "HYBRID" | "ONSITE">(
    "REMOTE"
  );
  const [stipend, setStipend] = useState<number>(45000);
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [skillsInput, setSkillsInput] = useState("");
  const [skills, setSkills] = useState<string[]>([
    "TypeScript",
    "React",
    "Node.js",
  ]);

  const [responsibilities, setResponsibilities] = useState<string[]>([
    "Collaborate with senior software engineers on scalable frontend components",
    "Participate in daily standups, code reviews, and architecture discussions",
  ]);

  const [requirements, setRequirements] = useState<string[]>([
    "Pursuing a degree in Computer Science, Software Engineering, or related field",
    "Hands-on experience with modern JavaScript / TypeScript",
  ]);

  const [status, setStatus] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const s = skillsInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillsInput("");
    }
  };

  const handleAddResp = () => {
    setResponsibilities([...responsibilities, ""]);
  };

  const handleUpdateResp = (idx: number, val: string) => {
    const arr = [...responsibilities];
    arr[idx] = val;
    setResponsibilities(arr);
  };

  const handleRemoveResp = (idx: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== idx));
  };

  const handleAddReq = () => {
    setRequirements([...requirements, ""]);
  };

  const handleUpdateReq = (idx: number, val: string) => {
    const arr = [...requirements];
    arr[idx] = val;
    setRequirements(arr);
  };

  const handleRemoveReq = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanResponsibilities = responsibilities.filter((r) => r.trim());
    const cleanRequirements = requirements.filter((r) => r.trim());

    if (!title.trim() || !description.trim() || !location.trim()) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          workMode,
          stipend: Number(stipend) || 0,
          durationMonths: Number(durationMonths) || 1,
          deadline: new Date(deadline).toISOString(),
          skills,
          responsibilities: cleanResponsibilities,
          requirements: cleanRequirements,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create internship");
        setLoading(false);
        return;
      }

      router.push("/recruiter/internships");
      router.refresh();
    } catch (err) {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 lg:py-12 relative overflow-hidden" style={{ background: "transparent" }}>
      {/* Ambient background glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/8 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-60 right-10 w-96 h-96 bg-indigo-500/8 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-6">
          <Link
            href="/recruiter/internships"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Manage Internships
          </Link>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full pill-blue text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Recruiter Opportunity Publisher</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Post an Internship
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Publish a new role to connect with thousands of vetted students.
          </p>
        </div>

        {error && (
          <div
            className="mb-6 p-4 rounded-2xl text-xs text-rose-300 flex items-center gap-2.5 animate-in fade-in"
            style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)" }}
          >
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Details */}
          <div
            className="rounded-3xl p-6 sm:p-8 space-y-5"
            style={{
              background: "rgba(15,23,42,0.85)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 24px -4px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center gap-2 text-base font-bold text-white border-b border-white/[0.08] pb-3">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <span>Role Overview</span>
            </div>

            <Input
              label="Internship Role Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Frontend Engineering Intern, Data Science Intern"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Work Mode"
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as any)}
                options={[
                  { value: "REMOTE", label: "Remote" },
                  { value: "HYBRID", label: "Hybrid" },
                  { value: "ONSITE", label: "On-site" },
                ]}
              />

              <Input
                label="Location (City, State / Remote)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru, India or Remote"
                required
              />

              <Select
                label="Listing Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                options={[
                  { value: "PUBLISHED", label: "Published (Live Now)" },
                  { value: "DRAFT", label: "Draft (Saved Privately)" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Monthly Stipend (₹ INR)"
                type="number"
                value={stipend}
                onChange={(e) => setStipend(Number(e.target.value))}
                min={0}
                required
                helperText="Enter 0 for unpaid / competitive"
              />

              <Input
                label="Duration (Months)"
                type="number"
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                min={1}
                max={24}
                required
              />

              <Input
                label="Application Deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <Textarea
              label="Job Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive summary of the team, the project, and what the intern will learn..."
              rows={4}
              required
            />
          </div>

          {/* Key Responsibilities */}
          <div
            className="rounded-3xl p-6 sm:p-8 space-y-4"
            style={{
              background: "rgba(15,23,42,0.85)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 24px -4px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2 text-base font-bold text-white">
                <ListChecks className="w-5 h-5 text-blue-400" />
                <span>Key Responsibilities</span>
              </div>
              <button
                type="button"
                onClick={handleAddResp}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-300 bg-blue-500/15 border border-blue-500/30 hover:bg-blue-500/25 flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {responsibilities.map((resp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={resp}
                    onChange={(e) => handleUpdateResp(idx, e.target.value)}
                    placeholder={`Responsibility #${idx + 1}`}
                    className="block w-full rounded-xl border border-white/[0.1] text-sm py-2.5 px-3.5 text-white bg-slate-900/80 focus:outline-none focus:border-blue-500"
                    required
                  />
                  {responsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveResp(idx)}
                      className="p-2 text-rose-400 hover:bg-rose-500/15 rounded-xl transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div
            className="rounded-3xl p-6 sm:p-8 space-y-4"
            style={{
              background: "rgba(15,23,42,0.85)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 24px -4px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2 text-base font-bold text-white">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                <span>Requirements & Eligibility</span>
              </div>
              <button
                type="button"
                onClick={handleAddReq}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-300 bg-blue-500/15 border border-blue-500/30 hover:bg-blue-500/25 flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleUpdateReq(idx, e.target.value)}
                    placeholder={`Requirement #${idx + 1}`}
                    className="block w-full rounded-xl border border-white/[0.1] text-sm py-2.5 px-3.5 text-white bg-slate-900/80 focus:outline-none focus:border-blue-500"
                    required
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveReq(idx)}
                      className="p-2 text-rose-400 hover:bg-rose-500/15 rounded-xl transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div
            className="rounded-3xl p-6 sm:p-8 space-y-4"
            style={{
              background: "rgba(15,23,42,0.85)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 24px -4px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center gap-2 text-base font-bold text-white border-b border-white/[0.08] pb-3">
              <span>Required Tech Skills</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="e.g. Next.js, Docker, Python (Press Enter)"
                className="block w-full rounded-xl border border-white/[0.1] text-sm py-2.5 px-3.5 text-white bg-slate-900/80 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-800/90 text-blue-300 border border-white/[0.08]"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => setSkills(skills.filter((s) => s !== skill))}
                    className="text-slate-400 hover:text-rose-400 ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Link href="/recruiter/internships">
              <button
                type="button"
                className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white border border-white/[0.1] hover:bg-white/[0.06] transition-all cursor-pointer"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
            >
              {loading ? "Publishing..." : "Publish Internship"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
