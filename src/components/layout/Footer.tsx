import React from "react";
import Link from "next/link";
import { Briefcase, Github, Twitter, Linkedin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Intern<span className="text-blue-500">Hub</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              The modern marketplace connecting ambitious students with verified tech companies, startups, and high-impact internships worldwide.
            </p>
            <div className="flex items-center gap-4 text-slate-400 pt-2">
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Students Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              For Students
            </h4>
            <ul className="space-y-2 text-xs">
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              For Employers
            </h4>
            <ul className="space-y-2 text-xs">
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Platform & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Verified Recruiter Network
              </li>
              <li>Transparent Stipends Only</li>
              <li>Anti-Ghosting Application Lifecycle</li>
              <li>PostgreSQL & Prisma Driven</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} InternHub Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
