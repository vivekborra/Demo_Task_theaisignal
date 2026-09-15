"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  ListChecks,
} from "lucide-react";

export default function NewInternshipPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState<"REMOTE" | "HYBRID" | "ONSITE">(
    "REMOTE"
  );
  const [stipend, setStipend] = useState<number>(2500);
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [skillsInput, setSkillsInput] = useState("");
  const [skills, setSkills] = useState<string[]>([
    "TypeScript",
    "React",
    "TailwindCSS",
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

    if (cleanResponsibilities.length === 0) {
      setError("Please provide at least one key responsibility.");
      setLoading(false);
      return;
    }

    if (cleanRequirements.length === 0) {
      setError("Please provide at least one eligibility requirement.");
      setLoading(false);
      return;
    }

    if (skills.length === 0) {
      setError("Please add at least one relevant technical skill tag.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          location,
          workMode,
          stipend: Number(stipend),
          durationMonths: Number(durationMonths),
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
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/recruiter/internships"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Manage Internships
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Post an Internship
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Publish a new role to connect with thousands of vetted students.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
              <Briefcase className="w-5 h-5 text-blue-600" />
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
                placeholder="e.g. San Francisco, CA or Remote"
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
                label="Monthly Stipend ($ USD)"
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
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <ListChecks className="w-5 h-5 text-blue-600" />
                <span>Key Responsibilities</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddResp}
                className="gap-1 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {responsibilities.map((resp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={resp}
                    onChange={(e) => handleUpdateResp(idx, e.target.value)}
                    placeholder={`Responsibility #${idx + 1}`}
                    className="block w-full rounded-lg border border-slate-300 text-sm py-2 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {responsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveResp(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span>Requirements & Eligibility</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddReq}
                className="gap-1 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleUpdateReq(idx, e.target.value)}
                    placeholder={`Requirement #${idx + 1}`}
                    className="block w-full rounded-lg border border-slate-300 text-sm py-2 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveReq(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
              <span>Required Tech Skills</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="e.g. Next.js, Docker, Python (Press Enter)"
                className="block w-full rounded-lg border border-slate-300 text-sm py-2 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSkill}
                className="shrink-0"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Skill
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => setSkills(skills.filter((s) => s !== skill))}
                    className="text-slate-500 hover:text-slate-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Link href="/recruiter/internships">
              <Button variant="outline" size="md" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" size="md" isLoading={loading} className="shadow-sm">
              Publish Internship
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
