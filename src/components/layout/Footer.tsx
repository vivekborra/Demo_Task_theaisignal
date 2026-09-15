import React from "react";
import Link from "next/link";
import { Briefcase, Github, Twitter, Linkedin, Heart, ShieldCheck, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Intern<span className="text-blue-400">Hub</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              The modern marketplace connecting ambitious students with verified tech companies, startups, and high-impact internships worldwide.
            </p>
            <div className="flex items-center gap-3 text-slate-400 pt-1">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:text-white hover:bg-slate-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:text-white hover:bg-slate-700 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:text-white hover:bg-slate-700 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Students Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              For Students
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/internships" className="hover:text-white transition-colors">
                  Explore All Internships
                </Link>
              </li>
              <li>
                <Link href="/internships?workMode=REMOTE" className="hover:text-white transition-colors">
                  Remote Internships
                </Link>
              </li>
              <li>
                <Link href="/internships?skills=TypeScript" className="hover:text-white transition-colors">
                  Engineering Roles
                </Link>
              </li>
              <li>
                <Link href="/student/profile" className="hover:text-white transition-colors">
                  Student Profile Builder
                </Link>
              </li>
              <li>
                <Link href="/student/applications" className="hover:text-white transition-colors">
                  Application Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              For Employers
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/recruiter/internships/new" className="hover:text-white transition-colors">
                  Post an Internship
                </Link>
              </li>
              <li>
                <Link href="/recruiter" className="hover:text-white transition-colors">
                  Recruiter Dashboard
                </Link>
              </li>
              <li>
                <Link href="/recruiter/company" className="hover:text-white transition-colors">
                  Company Branding
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Recruiter Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Trust Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Platform & Trust
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold">All systems operational</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Protected by role-based RBAC, encrypted sessions, and verified company audits.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Anti-Ghosting Policy Enforced
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} InternHub Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
