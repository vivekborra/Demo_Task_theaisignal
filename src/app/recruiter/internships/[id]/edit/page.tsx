"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
  Briefcase,
  ListChecks,
  CheckCircle2,
} from "lucide-react";

export default function EditInternshipPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState<"REMOTE" | "HYBRID" | "ONSITE">(
    "REMOTE"
  );
  const [stipend, setStipend] = useState<number>(0);
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [deadline, setDeadline] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [status, setStatus] = useState<"PUBLISHED" | "DRAFT" | "CLOSED">(
    "PUBLISHED"
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/internships/${id}`);
        if (!res.ok) {
          setError("Internship not found or unauthorized");
          return;
        }
        const data = await res.json();
        const item = data.internship;
        if (item) {
          setTitle(item.title);
          setDescription(item.description);
          setLocation(item.location);
          setWorkMode(item.workMode);
          setStipend(item.stipend);
          setDurationMonths(item.durationMonths);
          setDeadline(
            new Date(item.deadline).toISOString().split("T")[0]
          );
          setSkills(item.skills || []);
          setResponsibilities(item.responsibilities || []);
          setRequirements(item.requirements || []);
          setStatus(item.status);
        }
      } catch (err) {
        setError("Failed to load internship");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const s = skillsInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillsInput("");
    }
  };

  const handleAddResp = () => setResponsibilities([...responsibilities, ""]);
  const handleUpdateResp = (idx: number, val: string) => {
    const arr = [...responsibilities];
    arr[idx] = val;
    setResponsibilities(arr);
  };
  const handleRemoveResp = (idx: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== idx));
  };

  const handleAddReq = () => setRequirements([...requirements, ""]);
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
    setSaving(true);
    setError(null);

    const cleanResponsibilities = responsibilities.filter((r) => r.trim());
    const cleanRequirements = requirements.filter((r) => r.trim());

    if (cleanResponsibilities.length === 0) {
      setError("Please provide at least one responsibility.");
      setSaving(false);
      return;
    }

    if (cleanRequirements.length === 0) {
      setError("Please provide at least one requirement.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/internships/${id}`, {
        method: "PATCH",
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
        setError(data.error || "Failed to update internship");
        setSaving(false);
        return;
      }

      router.push("/recruiter/internships");
      router.refresh();
    } catch (err) {
      setError("An unexpected network error occurred.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-pulse space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="mb-4">
          <Link
            href="/recruiter/internships"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Manage Internships
          </Link>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Edit Internship
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Update role specifications, requirements, compensation, or status.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span>Role Overview</span>
            </div>

            <Input
              label="Internship Role Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />

              <Select
                label="Listing Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                options={[
                  { value: "PUBLISHED", label: "Published (Active)" },
                  { value: "DRAFT", label: "Draft" },
                  { value: "CLOSED", label: "Closed" },
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
              />

              <Input
                label="Duration (Months)"
                type="number"
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                min={1}
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
              rows={4}
              required
            />
          </div>

          {/* Responsibilities */}
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
                    className="block w-full rounded-lg border border-slate-300 text-sm py-2 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveResp(idx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
                    className="block w-full rounded-lg border border-slate-300 text-sm py-2 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveReq(idx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
                placeholder="e.g. Next.js, Docker (Press Enter)"
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
            <Button type="submit" size="md" isLoading={saving} className="shadow-sm">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
