"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import {
  User,
  GraduationCap,
  Briefcase,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code2,
} from "lucide-react";

interface EducationItem {
  id?: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number | null;
}

export default function StudentProfilePage() {
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [education, setEducation] = useState<EducationItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          const p = data.profile;
          if (p) {
            setName(p.user?.name || "");
            setHeadline(p.headline || "");
            setBio(p.bio || "");
            setSkills(p.skills || []);
            setResumeUrl(p.resumeUrl || "");
            setLinkedinUrl(p.linkedinUrl || "");
            setGithubUrl(p.githubUrl || "");
            setPortfolioUrl(p.portfolioUrl || "");
            setEducation(p.education || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const s = newSkillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddEducation = () => {
    setEducation([
      ...education,
      {
        degree: "Bachelor of Science",
        institution: "",
        fieldOfStudy: "Computer Science",
        startYear: new Date().getFullYear() - 2,
        endYear: new Date().getFullYear() + 2,
      },
    ]);
  };

  const handleRemoveEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleUpdateEducation = (
    index: number,
    field: keyof EducationItem,
    val: any
  ) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: val };
    setEducation(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          headline,
          bio,
          skills,
          resumeUrl: resumeUrl.trim() || null,
          linkedinUrl: linkedinUrl.trim() || null,
          githubUrl: githubUrl.trim() || null,
          portfolioUrl: portfolioUrl.trim() || null,
          education,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to update profile");
      } else {
        setSuccessMsg("Profile saved successfully!");
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      setErrorMsg("A network error occurred while updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-pulse space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Student Profile
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Keep your profile up-to-date. Recruiters see this information when you apply.
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            size="md"
            isLoading={saving}
            className="shadow-sm self-start sm:self-auto"
          >
            Save Changes
          </Button>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
              <User className="w-5 h-5 text-blue-600" />
              <span>General Information</span>
            </div>

            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Junior CS Student at UC Berkeley | Full-Stack & Systems"
              helperText="A punchy 1-line summary that recruiters see on your candidate card."
            />

            <Textarea
              label="About / Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share your interests, key achievements, and the types of engineering projects you enjoy building..."
              rows={4}
            />
          </div>

          {/* Technical Skills Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
              <Code2 className="w-5 h-5 text-blue-600" />
              <span>Technical Skills</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Add Skills (Type and press Enter)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="e.g. TypeScript, React, Docker, PyTorch"
                  className="block w-full rounded-lg border border-slate-300 text-sm py-2 px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSkill}
                  className="shrink-0"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
              {skills.length === 0 && (
                <p className="text-xs text-slate-400 italic">
                  No skills added yet. Add skills to match with recruiter job descriptions.
                </p>
              )}
            </div>
          </div>

          {/* Links & Portfolio Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
              <ExternalLink className="w-5 h-5 text-blue-600" />
              <span>Resume & Web Links</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Resume URL (PDF / Cloud Link)"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://yourname.dev/resume.pdf"
              />
              <Input
                label="Portfolio / Personal Website"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://yourname.dev"
              />
              <Input
                label="GitHub Profile URL"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
              />
              <Input
                label="LinkedIn Profile URL"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>

          {/* Education History Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span>Education</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddEducation}
                className="gap-1 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add School
              </Button>
            </div>

            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Entry #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(idx)}
                      className="p-1 rounded text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Remove education"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Institution / University"
                      value={edu.institution}
                      onChange={(e) =>
                        handleUpdateEducation(idx, "institution", e.target.value)
                      }
                      placeholder="e.g. University of Washington"
                      required
                    />
                    <Input
                      label="Degree"
                      value={edu.degree}
                      onChange={(e) =>
                        handleUpdateEducation(idx, "degree", e.target.value)
                      }
                      placeholder="e.g. Bachelor of Science"
                      required
                    />
                    <Input
                      label="Field of Study / Major"
                      value={edu.fieldOfStudy}
                      onChange={(e) =>
                        handleUpdateEducation(idx, "fieldOfStudy", e.target.value)
                      }
                      placeholder="e.g. Computer Science"
                      required
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Start Year"
                        type="number"
                        value={edu.startYear}
                        onChange={(e) =>
                          handleUpdateEducation(
                            idx,
                            "startYear",
                            Number(e.target.value)
                          )
                        }
                        required
                      />
                      <Input
                        label="Graduation Year"
                        type="number"
                        value={edu.endYear || ""}
                        onChange={(e) =>
                          handleUpdateEducation(
                            idx,
                            "endYear",
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                        placeholder="Expected"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {education.length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-4">
                  No education entries recorded yet. Click "Add School" to add your university.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" isLoading={saving} className="shadow-sm">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
