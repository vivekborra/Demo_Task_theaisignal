import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "InternHub | Find the Internship That Moves Your Career Forward",
  description:
    "The leading marketplace connecting college students with high-impact software engineering, data science, AI, design, and product internships at top tech companies.",
  keywords: [
    "internships",
    "software engineering intern",
    "student jobs",
    "tech internships",
    "remote internships",
    "summer 2025 internships",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark">
      <body className="font-sans min-h-screen flex flex-col antialiased text-slate-100" style={{ backgroundColor: '#0a0f1e' }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
