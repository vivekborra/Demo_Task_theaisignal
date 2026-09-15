"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
  Building,
  Globe,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from "lucide-react";

export default function RecruiterCompanyPage() {
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadCompany() {
      try {
        const res = await fetch("/api/company");
        if (res.ok) {
          const data = await res.json();
          const c = data.company;
          if (c) {
            setName(c.name || "");
            setLogoUrl(c.logoUrl || "");
            setWebsite(c.website || "");
            setDescription(c.description || "");
            setLocation(c.location || "");
            setIndustry(c.industry || "");
            setSize(c.size || "");
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCompany();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/company", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          logoUrl: logoUrl.trim() || null,
          website: website.trim() || null,
          description: description.trim() || null,
          location: location.trim() || null,
          industry: industry.trim() || null,
          size: size.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to update company profile");
      } else {
        setSuccessMsg("Company profile updated successfully!");
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      setErrorMsg("A network error occurred while updating company profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 animate-pulse space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12 relative overflow-hidden" style={{ background: "transparent" }}>
      {/* Ambient background glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-500/8 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-60 right-10 w-96 h-96 bg-blue-500/8 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Company Profile
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Your company branding and mission appear on all your internship listings.
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
          <div className="p-4 rounded-xl text-sm text-emerald-300 flex items-center gap-2.5" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl text-sm text-rose-300 flex items-center gap-2.5" style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)" }}>
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              <Building className="w-5 h-5 text-blue-400" />
              <span>Company Information</span>
            </div>

            <Input
              label="Company Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Logo URL (Image Link)"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                helperText="Direct image URL for your company logo"
              />

              <Input
                label="Website URL"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourcompany.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Headquarters Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA"
              />

              <Input
                label="Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Cloud Infrastructure"
              />

              <Select
                label="Company Size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                options={[
                  { value: "", label: "Select Size" },
                  { value: "1-10 employees", label: "1-10 employees (Seed)" },
                  { value: "10-50 employees", label: "10-50 employees (Early)" },
                  { value: "50-100 employees", label: "50-100 employees" },
                  { value: "100-250 employees", label: "100-250 employees" },
                  { value: "250-500 employees", label: "250-500 employees" },
                  { value: "500+ employees", label: "500+ employees (Enterprise)" },
                ]}
              />
            </div>

            <Textarea
              label="Company Bio & Mission"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell prospective interns about your company culture, engineering values, and what makes working here impactful..."
              rows={4}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="lg" isLoading={saving} className="shadow-sm">
              Save Company Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
