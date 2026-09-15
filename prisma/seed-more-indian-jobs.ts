import { PrismaClient, Role, WorkMode, InternshipStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding additional top-tier Indian opportunities for Gurugram, Noida, Delhi & Chennai...");

  const saltRounds = 10;
  const commonPassword = await bcrypt.hash("password123", saltRounds);

  // Helper to upsert recruiter and company
  async function getOrCreateCompany(email: string, name: string, companyData: {
    name: string;
    logoUrl: string;
    website: string;
    description: string;
    location: string;
    industry: string;
    size: string;
  }) {
    let user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash: commonPassword,
          role: Role.RECRUITER,
          company: {
            create: companyData,
          },
        },
        include: { company: true },
      });
    }

    return user.company!;
  }

  // ─── GURUGRAM (Delhi NCR Hub 1) ──────────────────────────────────────────
  const zomato = await getOrCreateCompany("recruiter.zomato@demo.com", "Deepinder Goyal", {
    name: "Zomato",
    logoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=128&auto=format&fit=crop&q=80",
    website: "https://zomato.com",
    description: "Global restaurant discovery, dining reservation, and online food ordering technology ecosystem.",
    location: "Gurugram, India",
    industry: "Consumer Internet & FoodTech",
    size: "5000+ employees",
  });

  const blinkit = await getOrCreateCompany("recruiter.blinkit@demo.com", "Albinder Dhindsa", {
    name: "Blinkit",
    logoUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=128&auto=format&fit=crop&q=80",
    website: "https://blinkit.com",
    description: "India's instant commerce service delivering groceries and essentials in 10 minutes.",
    location: "Gurugram, India",
    industry: "Quick Commerce & Logistics",
    size: "2000+ employees",
  });

  const makemytrip = await getOrCreateCompany("recruiter.mmt@demo.com", "Rajesh Magow", {
    name: "MakeMyTrip",
    logoUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=128&auto=format&fit=crop&q=80",
    website: "https://makemytrip.com",
    description: "India's leading online travel company offering flight bookings, hotel reservations, and holiday packages.",
    location: "Gurugram, India",
    industry: "TravelTech & eCommerce",
    size: "3000+ employees",
  });

  // ─── NOIDA (Delhi NCR Hub 2) ─────────────────────────────────────────────
  const paytm = await getOrCreateCompany("recruiter.paytm@demo.com", "Vijay Shekhar Sharma", {
    name: "Paytm (One97)",
    logoUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&auto=format&fit=crop&q=80",
    website: "https://paytm.com",
    description: "India's pioneer in mobile QR payments, soundboxes, and digital financial inclusion.",
    location: "Noida, India",
    industry: "FinTech & Payments",
    size: "10000+ employees",
  });

  const pinelabs = await getOrCreateCompany("recruiter.pinelabs@demo.com", "Amrish Rau", {
    name: "Pine Labs",
    logoUrl: "https://images.unsplash.com/photo-1556742049-0a67e5572293?w=128&auto=format&fit=crop&q=80",
    website: "https://pinelabs.com",
    description: "Leading omnichannel merchant commerce and payment processing platform across APAC.",
    location: "Noida, India",
    industry: "Merchant FinTech",
    size: "2500+ employees",
  });

  const infoedge = await getOrCreateCompany("recruiter.infoedge@demo.com", "Sanjeev Bikhchandani", {
    name: "Info Edge (Naukri)",
    logoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80",
    website: "https://infoedge.in",
    description: "India's premier internet company operating Naukri.com, 99acres, Jeevansathi, and Shiksha.",
    location: "Noida, India",
    industry: "Internet & Recruitment Platforms",
    size: "4000+ employees",
  });

  // ─── DELHI (National Capital Hub) ────────────────────────────────────────
  const pw = await getOrCreateCompany("recruiter.pw@demo.com", "Alakh Pandey", {
    name: "PhysicsWallah",
    logoUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=128&auto=format&fit=crop&q=80",
    website: "https://pw.live",
    description: "India's fastest-growing EdTech unicorn democratizing affordable, high-quality competitive exam prep.",
    location: "Delhi, India",
    industry: "EdTech & Live Streaming",
    size: "4000+ employees",
  });

  const urbancompany = await getOrCreateCompany("recruiter.urbancompany@demo.com", "Abhiraj Bhal", {
    name: "Urban Company",
    logoUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=128&auto=format&fit=crop&q=80",
    website: "https://urbancompany.com",
    description: "Asia's largest home services marketplace connecting millions of customers with skilled service professionals.",
    location: "Delhi, India",
    industry: "Consumer Services & Marketplace",
    size: "2000+ employees",
  });

  // ─── CHENNAI (SaaS Capital of India) ─────────────────────────────────────
  const freshworks = await getOrCreateCompany("recruiter.freshworks@demo.com", "Girish Mathrubootham", {
    name: "Freshworks",
    logoUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&auto=format&fit=crop&q=80",
    website: "https://freshworks.com",
    description: "Global SaaS leader crafting AI-powered customer service, IT operations, and CRM software for over 60,000 businesses.",
    location: "Chennai, India",
    industry: "Enterprise SaaS & AI",
    size: "5000+ employees",
  });

  const zoho = await getOrCreateCompany("recruiter.zoho@demo.com", "Sridhar Vembu", {
    name: "Zoho Corporation",
    logoUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=128&auto=format&fit=crop&q=80",
    website: "https://zoho.com",
    description: "Global tech pioneer providing the operating system for business with 55+ integrated cloud applications.",
    location: "Chennai, India",
    industry: "Cloud & Productivity Software",
    size: "15000+ employees",
  });

  const futureDeadline = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  };

  const newJobs = [
    // ── GURUGRAM JOBS ──
    {
      title: "Full Stack Engineer Intern (React / Node)",
      description: "Join Zomato's consumer app team. Build high-concurrency feed modules, interactive menu widgets, and real-time order tracking experiences using Next.js, Node.js, and Redis.",
      location: "Gurugram, India",
      workMode: WorkMode.HYBRID,
      stipend: 55000,
      durationMonths: 6,
      deadline: futureDeadline(35),
      skills: ["React", "TypeScript", "Node.js", "Redis", "Next.js"],
      status: InternshipStatus.PUBLISHED,
      companyId: zomato.id,
    },
    {
      title: "Backend Platform Intern (Go / Distributed Systems)",
      description: "Design low-latency microservices powering rider dispatch and geo-spatial tracking at Zomato. Learn distributed consensus, Kafka event streaming, and PostgreSQL performance tuning.",
      location: "Gurugram, India",
      workMode: WorkMode.ONSITE,
      stipend: 60000,
      durationMonths: 6,
      deadline: futureDeadline(45),
      skills: ["Go", "Kafka", "PostgreSQL", "Docker", "Distributed Systems"],
      status: InternshipStatus.PUBLISHED,
      companyId: zomato.id,
    },
    {
      title: "Warehouse & Logistics Algorithms Intern",
      description: "Work on Blinkit's 10-minute delivery routing engine. Optimize dark store inventory picking paths, batch dispatching, and rider matching algorithms using Python and graph algorithms.",
      location: "Gurugram, India",
      workMode: WorkMode.ONSITE,
      stipend: 65000,
      durationMonths: 6,
      deadline: futureDeadline(30),
      skills: ["Python", "Algorithms", "Optimization", "PostgreSQL", "FastAPI"],
      status: InternshipStatus.PUBLISHED,
      companyId: blinkit.id,
    },
    {
      title: "Frontend Experience Intern (React Native)",
      description: "Craft pixel-perfect, hyper-responsive instant checkout and cart experiences for Blinkit's Android and iOS applications used by tens of millions of daily customers.",
      location: "Gurugram, India",
      workMode: WorkMode.HYBRID,
      stipend: 50000,
      durationMonths: 4,
      deadline: futureDeadline(40),
      skills: ["React Native", "TypeScript", "Redux Toolkit", "UI/UX", "Mobile"],
      status: InternshipStatus.PUBLISHED,
      companyId: blinkit.id,
    },
    {
      title: "Cloud Infrastructure & SRE Intern",
      description: "Help manage MakeMyTrip's hybrid cloud footprint serving millions of queries per second during festive holiday flash sales. Automate Kubernetes deployments, Prometheus alerts, and Terraform.",
      location: "Gurugram, India",
      workMode: WorkMode.HYBRID,
      stipend: 45000,
      durationMonths: 6,
      deadline: futureDeadline(50),
      skills: ["Kubernetes", "AWS", "Terraform", "Prometheus", "Linux"],
      status: InternshipStatus.PUBLISHED,
      companyId: makemytrip.id,
    },
    {
      title: "Data Science & Flight Pricing Intern",
      description: "Collaborate with MakeMyTrip's pricing science team to build dynamic airfare prediction models and personalized travel package recommenders using PyTorch and BigQuery.",
      location: "Gurugram, India",
      workMode: WorkMode.HYBRID,
      stipend: 55000,
      durationMonths: 6,
      deadline: futureDeadline(28),
      skills: ["Python", "Machine Learning", "PyTorch", "SQL", "Data Science"],
      status: InternshipStatus.PUBLISHED,
      companyId: makemytrip.id,
    },

    // ── NOIDA JOBS ──
    {
      title: "Payments Security & SDK Intern",
      description: "Build ultra-secure payment gateway SDKs and hardware integration layer for Paytm soundbox and POS terminals. Deep dive into cryptographic signatures and tokenization protocols.",
      location: "Noida, India",
      workMode: WorkMode.ONSITE,
      stipend: 50000,
      durationMonths: 6,
      deadline: futureDeadline(42),
      skills: ["Java", "Spring Boot", "Cryptography", "Security", "REST APIs"],
      status: InternshipStatus.PUBLISHED,
      companyId: paytm.id,
    },
    {
      title: "Android Core Architecture Intern",
      description: "Work on Paytm's flagship SuperApp Android architecture. Improve cold start performance, memory leaks, and modular dynamic feature delivery for 100M+ installs.",
      location: "Noida, India",
      workMode: WorkMode.ONSITE,
      stipend: 48000,
      durationMonths: 6,
      deadline: futureDeadline(38),
      skills: ["Android", "Kotlin", "Coroutines", "Jetpack Compose", "Gradle"],
      status: InternshipStatus.PUBLISHED,
      companyId: paytm.id,
    },
    {
      title: "Merchant API Platform Intern",
      description: "Design developer-first APIs and webhook delivery infrastructure for Pine Labs' payment devices. Work with high-throughput event buses and automated merchant onboarding flows.",
      location: "Noida, India",
      workMode: WorkMode.HYBRID,
      stipend: 45000,
      durationMonths: 5,
      deadline: futureDeadline(32),
      skills: ["Node.js", "TypeScript", "PostgreSQL", "Kafka", "API Design"],
      status: InternshipStatus.PUBLISHED,
      companyId: pinelabs.id,
    },
    {
      title: "Search Ranking & RecSys Intern",
      description: "Train semantic candidate matching models for Naukri.com's recruiter search engine. Implement vector search with FAISS/Milvus and transformer-based resume embeddings.",
      location: "Noida, India",
      workMode: WorkMode.HYBRID,
      stipend: 52000,
      durationMonths: 6,
      deadline: futureDeadline(45),
      skills: ["Python", "NLP", "Transformers", "Vector Databases", "Search"],
      status: InternshipStatus.PUBLISHED,
      companyId: infoedge.id,
    },

    // ── DELHI JOBS ──
    {
      title: "EdTech Video Streaming Infra Intern",
      description: "Build ultra-low latency WebRTC and HLS live streaming pipelines at PhysicsWallah supporting 500,000+ simultaneous live students during nationwide lectures.",
      location: "Delhi, India",
      workMode: WorkMode.ONSITE,
      stipend: 45000,
      durationMonths: 6,
      deadline: futureDeadline(35),
      skills: ["WebRTC", "FFmpeg", "Go", "AWS CloudFront", "Live Streaming"],
      status: InternshipStatus.PUBLISHED,
      companyId: pw.id,
    },
    {
      title: "Interactive Learning Frontend Intern",
      description: "Craft gamified quizzes, real-time classroom polls, and interactive coding notebooks for PhysicsWallah's Web and Tablet applications with Next.js and Tailwind.",
      location: "Delhi, India",
      workMode: WorkMode.HYBRID,
      stipend: 40000,
      durationMonths: 6,
      deadline: futureDeadline(40),
      skills: ["React", "TypeScript", "Next.js", "TailwindCSS", "Socket.io"],
      status: InternshipStatus.PUBLISHED,
      companyId: pw.id,
    },
    {
      title: "Service Partner Platform Intern",
      description: "Develop the partner app backend at Urban Company. Handle geolocation-based task allocation, partner earnings calculations, and automated training modules.",
      location: "Delhi, India",
      workMode: WorkMode.HYBRID,
      stipend: 50000,
      durationMonths: 6,
      deadline: futureDeadline(30),
      skills: ["Node.js", "TypeScript", "MongoDB", "Redis", "Microservices"],
      status: InternshipStatus.PUBLISHED,
      companyId: urbancompany.id,
    },
    {
      title: "Quality Assurance & Automation Intern",
      description: "Build automated end-to-end testing suites for Urban Company's booking flows across web and mobile using Playwright and Appium.",
      location: "Delhi, India",
      workMode: WorkMode.HYBRID,
      stipend: 38000,
      durationMonths: 4,
      deadline: futureDeadline(25),
      skills: ["Playwright", "TypeScript", "Jest", "CI/CD", "Testing"],
      status: InternshipStatus.PUBLISHED,
      companyId: urbancompany.id,
    },

    // ── CHENNAI JOBS ──
    {
      title: "SaaS Platform Engineering Intern",
      description: "Build multi-tenant customer engagement APIs for Freshdesk and Freshservice. Work with distributed databases, rate limiting, and enterprise SSO integrations.",
      location: "Chennai, India",
      workMode: WorkMode.HYBRID,
      stipend: 50000,
      durationMonths: 6,
      deadline: futureDeadline(45),
      skills: ["Ruby on Rails", "Java", "AWS", "MySQL", "SaaS Architecture"],
      status: InternshipStatus.PUBLISHED,
      companyId: freshworks.id,
    },
    {
      title: "AI Agent & Workflow Copilot Intern",
      description: "Integrate LLM-driven ticket deflection and automated customer sentiment classification into Freshworks' Freddy AI platform using LangChain and Python.",
      location: "Chennai, India",
      workMode: WorkMode.HYBRID,
      stipend: 55000,
      durationMonths: 6,
      deadline: futureDeadline(50),
      skills: ["Python", "OpenAI / LLMs", "LangChain", "FastAPI", "Prompt Engineering"],
      status: InternshipStatus.PUBLISHED,
      companyId: freshworks.id,
    },
    {
      title: "Cloud Kernel & Distributed File System Intern",
      description: "Deep-dive into Zoho's proprietary distributed storage and database engine powering Zoho Mail and Docs for 100M+ accounts worldwide.",
      location: "Chennai, India",
      workMode: WorkMode.ONSITE,
      stipend: 45000,
      durationMonths: 6,
      deadline: futureDeadline(60),
      skills: ["C", "C++", "Java", "Operating Systems", "Distributed Storage"],
      status: InternshipStatus.PUBLISHED,
      companyId: zoho.id,
    },
    {
      title: "Web Components & Design System Intern",
      description: "Build accessible, lightweight, high-performance UI components using Zoho's custom Web Components framework with zero external dependencies.",
      location: "Chennai, India",
      workMode: WorkMode.ONSITE,
      stipend: 40000,
      durationMonths: 6,
      deadline: futureDeadline(40),
      skills: ["JavaScript", "Web Components", "CSS", "Accessibility", "Performance"],
      status: InternshipStatus.PUBLISHED,
      companyId: zoho.id,
    },
    {
      title: "Mobile App Performance & Security Intern",
      description: "Audit Zoho workplace mobile apps for memory optimization, battery consumption, and end-to-end data encryption compliance.",
      location: "Chennai, India",
      workMode: WorkMode.ONSITE,
      stipend: 42000,
      durationMonths: 5,
      deadline: futureDeadline(35),
      skills: ["Kotlin", "Swift", "Mobile Security", "Profiling", "Android"],
      status: InternshipStatus.PUBLISHED,
      companyId: zoho.id,
    },
  ];

  let createdCount = 0;
  for (const job of newJobs) {
    const existing = await prisma.internship.findFirst({
      where: {
        title: job.title,
        companyId: job.companyId,
      },
    });

    if (!existing) {
      await prisma.internship.create({
        data: job,
      });
      createdCount++;
    }
  }

  console.log(`Successfully seeded ${createdCount} additional Indian internships!`);
}

main()
  .catch((e) => {
    console.error("Error seeding additional opportunities:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
