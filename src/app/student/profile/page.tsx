"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
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
  Sparkles,
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
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startYear: new Date().getFullYear(),
        endYear: new Date().getFullYear() + 2,
      },
    ]);
  };

  const handleUpdateEducation = (
    index: number,
    field: keyof EducationItem,
    value: any
  ) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const handleRemoveEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

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
        <div className="h-8 w-48 bg-slate-800 rounded-lg" />
        <div className="h-64 bg-slate-800/80 rounded-2xl" />
        <div className="h-64 bg-slate-800/80 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12 relative overflow-hidden" style={{ background: "transparent" }}>
      {/* Ambient background glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/8 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-60 right-10 w-96 h-96 bg-indigo-500/8 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full pill-blue text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Verified Candidate Profile</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Student Profile
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Recruiters see this information automatically when you submit applications.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer self-start sm:self-auto"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>

        {successMsg && (
          <div
            className="mb-6 p-4 rounded-2xl text-xs text-emerald-300 flex items-center gap-2.5"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div
            className="mb-6 p-4 rounded-2xl text-xs text-rose-300 flex items-center gap-2.5"
            style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)" }}
          >
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Card */}
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
              <User className="w-5 h-5 text-blue-400" />
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
              placeholder="e.g. 3rd Year CS Student at IIT Delhi | Distributed Systems & GenAI"
              helperText="A punchy 1-line summary that recruiters see on your applicant card."
            />

            <Textarea
              label="About / Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share your technical interests, hackathon projects, and what engineering challenges excite you..."
              rows={4}
            />
          </div>

          {/* Technical Skills Card */}
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
              <Code2 className="w-5 h-5 text-blue-400" />
              <span>Technical Skills</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Add Skills (Type and press Enter or click Add)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="e.g. TypeScript, React, Docker, PyTorch, Go"
                  className="block w-full rounded-xl border border-white/[0.1] text-sm py-2.5 px-3.5 text-white placeholder:text-slate-500 bg-slate-900/80 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-800/90 text-blue-300 border border-white/[0.08]"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-400 text-slate-400 transition-colors ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              {skills.length === 0 && (
                <p className="text-xs text-slate-500 italic">
                  No skills added yet. Add skills to match with recruiter job descriptions.
                </p>
              )}
            </div>
          </div>

          {/* Links & Portfolio Card */}
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
              <ExternalLink className="w-5 h-5 text-blue-400" />
              <span>Resume & Web Links</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Resume URL (PDF / Google Drive)"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/your-resume.pdf"
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
          <div
            className="rounded-3xl p-6 sm:p-8 space-y-5"
            style={{
              background: "rgba(15,23,42,0.85)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 24px -4px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2 text-base font-bold text-white">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <span>Education</span>
              </div>
              <button
                type="button"
                onClick={handleAddEducation}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-300 bg-blue-500/15 border border-blue-500/30 hover:bg-blue-500/25 flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add School
              </button>
            </div>

            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-white/[0.08] relative space-y-4"
                  style={{ background: "rgba(30,41,59,0.5)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Entry #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(idx)}
                      className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
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
                      placeholder="e.g. IIT Delhi, BITS Pilani"
                      required
                    />
                    <Input
                      label="Degree"
                      value={edu.degree}
                      onChange={(e) =>
                        handleUpdateEducation(idx, "degree", e.target.value)
                      }
                      placeholder="e.g. Bachelor of Technology"
                      required
                    />
                    <Input
                      label="Field of Study / Major"
                      value={edu.fieldOfStudy}
                      onChange={(e) =>
                        handleUpdateEducation(idx, "fieldOfStudy", e.target.value)
                      }
                      placeholder="e.g. Computer Science & Engineering"
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
                <p className="text-xs text-slate-500 italic text-center py-4">
                  No education entries recorded yet. Click "Add School" to add your college or university.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
            >
              {saving ? "Saving Changes..." : "Save Profile Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
