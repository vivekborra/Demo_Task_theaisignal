import { PrismaClient, Role, WorkMode, InternshipStatus, ApplicationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with realistic opportunities across all major Indian tech hubs & global cities...');

  // Clean existing records in reverse dependency order
  await prisma.application.deleteMany();
  await prisma.internship.deleteMany();
  await prisma.company.deleteMany();
  await prisma.education.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = 10;
  const commonPassword = await bcrypt.hash('password123', saltRounds);

  // 1. GLOBAL COMPANIES & RECRUITERS
  const recruiterUser = await prisma.user.create({
    data: {
      email: 'recruiter@demo.com',
      name: 'Sarah Jenkins',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'NexusCloud Systems',
          logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
          website: 'https://nexuscloud.io',
          description: 'Enterprise cloud infrastructure and distributed observability platform serving Fortune 500 engineering teams worldwide.',
          location: 'San Francisco, CA',
          industry: 'Cloud Infrastructure & DevOps',
          size: '250-500 employees',
        },
      },
    },
    include: { company: true },
  });

  const recruiter2 = await prisma.user.create({
    data: {
      email: 'recruiter.finpulse@demo.com',
      name: 'Marcus Vance',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'FinPulse Technologies',
          logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80',
          website: 'https://finpulse.ai',
          description: 'Next-generation algorithmic trading, automated risk modeling, and financial transaction intelligence.',
          location: 'New York, NY',
          industry: 'FinTech & AI',
          size: '100-250 employees',
        },
      },
    },
    include: { company: true },
  });

  const recruiter3 = await prisma.user.create({
    data: {
      email: 'recruiter.healthai@demo.com',
      name: 'Dr. Elena Rostova',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'HealthAI Labs',
          logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=128&auto=format&fit=crop&q=80',
          website: 'https://healthailabs.org',
          description: 'Accelerating diagnostic radiology workflows and patient care pathways with computer vision and clinical NLP models.',
          location: 'Boston, MA',
          industry: 'HealthTech & BioInformatics',
          size: '50-100 employees',
        },
      },
    },
    include: { company: true },
  });

  // 2. BENGALURU COMPANIES
  const recruiterRazorpay = await prisma.user.create({
    data: {
      email: 'recruiter.razorpay@demo.com',
      name: 'Arjun Nambiar',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'Razorpay',
          logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&auto=format&fit=crop&q=80',
          website: 'https://razorpay.com',
          description: "India's leading full-stack payments and banking platform powering money movement for millions of businesses.",
          location: 'Bengaluru, Karnataka, India',
          industry: 'FinTech & Payments',
          size: '1000+ employees',
        },
      },
    },
    include: { company: true },
  });

  const recruiterSwiggy = await prisma.user.create({
    data: {
      email: 'recruiter.swiggy@demo.com',
      name: 'Sneha Kulkarni',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'Swiggy',
          logoUrl: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=128&auto=format&fit=crop&q=80',
          website: 'https://swiggy.com',
          description: "India's pioneer consumer on-demand logistics, quick commerce, and food delivery ecosystem.",
          location: 'Bengaluru, Karnataka, India',
          industry: 'Consumer Tech & AI Logistics',
          size: '5000+ employees',
        },
      },
    },
    include: { company: true },
  });

  const recruiterCRED = await prisma.user.create({
    data: {
      email: 'recruiter.cred@demo.com',
      name: 'Rohan Verma',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'CRED',
          logoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=128&auto=format&fit=crop&q=80',
          website: 'https://cred.club',
          description: 'High-trust, design-led financial rewards community celebrating creditworthy individuals with state-of-the-art products.',
          location: 'Bengaluru, Karnataka, India',
          industry: 'FinTech & Design Systems',
          size: '500-1000 employees',
        },
      },
    },
    include: { company: true },
  });

  const recruiterSarvam = await prisma.user.create({
    data: {
      email: 'recruiter.sarvam@demo.com',
      name: 'Dr. Vivek Murthy',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'Sarvam AI',
          logoUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=128&auto=format&fit=crop&q=80',
          website: 'https://sarvam.ai',
          description: 'Frontier AI research institute building foundational multilingual LLMs and voice intelligence for India.',
          location: 'Bengaluru, Karnataka, India',
          industry: 'Generative AI & LLMs',
          size: '50-100 employees',
        },
      },
    },
    include: { company: true },
  });

  const recruiter4 = await prisma.user.create({
    data: {
      email: 'recruiter.devorbit@demo.com',
      name: 'Kavita Iyer',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'DevOrbit Tools',
          logoUrl: 'https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=128&auto=format&fit=crop&q=80',
          website: 'https://devorbit.dev',
          description: 'Developer productivity suite building blazingly fast CI/CD pipelines and micro-service testing sandboxes.',
          location: 'Bengaluru, Karnataka, India',
          industry: 'Developer Tools',
          size: '20-50 employees',
        },
      },
    },
    include: { company: true },
  });

  // 3. HYDERABAD COMPANIES
  const recruiterDarwinbox = await prisma.user.create({
    data: {
      email: 'recruiter.darwinbox@demo.com',
      name: 'Praneeth Reddy',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'Darwinbox',
          logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=128&auto=format&fit=crop&q=80',
          website: 'https://darwinbox.com',
          description: 'Global enterprise human capital management SaaS platform powering modern workforces across Asia-Pacific.',
          location: 'Hyderabad, Telangana, India',
          industry: 'Enterprise SaaS & HRTech',
          size: '1000+ employees',
        },
      },
    },
    include: { company: true },
  });

  const recruiterHighRadius = await prisma.user.create({
    data: {
      email: 'recruiter.highradius@demo.com',
      name: 'Ananya Rao',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'HighRadius',
          logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80',
          website: 'https://highradius.com',
          description: 'Autonomous finance software utilizing AI and machine learning for order-to-cash and treasury operations.',
          location: 'Hyderabad, Telangana, India',
          industry: 'FinTech & AI SaaS',
          size: '2000+ employees',
        },
      },
    },
    include: { company: true },
  });

  // 4. DELHI NCR / GURUGRAM COMPANIES
  const recruiterZomato = await prisma.user.create({
    data: {
      email: 'recruiter.zomato@demo.com',
      name: 'Aditi Deshmukh',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'Zomato',
          logoUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=128&auto=format&fit=crop&q=80',
          website: 'https://zomato.com',
          description: "India's premier food ordering, dining-out discovery, and hyper-local delivery ecosystem.",
          location: 'Gurugram, Delhi NCR, India',
          industry: 'Food Tech & Hyperlocal Supply Chain',
          size: '2000+ employees',
        },
      },
    },
    include: { company: true },
  });

  const recruiterPaytm = await prisma.user.create({
    data: {
      email: 'recruiter.paytm@demo.com',
      name: 'Siddharth Saxena',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'Paytm',
          logoUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=128&auto=format&fit=crop&q=80',
          website: 'https://paytm.com',
          description: 'Pioneer of digital payments, QR payments, and consumer soundbox technology in India.',
          location: 'Noida, Delhi NCR, India',
          industry: 'FinTech & Payments',
          size: '5000+ employees',
        },
      },
    },
    include: { company: true },
  });

  // 5. PUNE COMPANIES
  const recruiterIcertis = await prisma.user.create({
    data: {
      email: 'recruiter.icertis@demo.com',
      name: 'Tanuja Joshi',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'Icertis',
          logoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=128&auto=format&fit=crop&q=80',
          website: 'https://icertis.com',
          description: 'The contract intelligence platform transforming the foundation of global commerce with generative AI.',
          location: 'Pune, Maharashtra, India',
          industry: 'Enterprise SaaS & LegalTech',
          size: '2000+ employees',
        },
      },
    },
    include: { company: true },
  });

  const recruiterDruva = await prisma.user.create({
    data: {
      email: 'recruiter.druva@demo.com',
      name: 'Nikhil Patil',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'Druva',
          logoUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=128&auto=format&fit=crop&q=80',
          website: 'https://druva.com',
          description: 'Cloud data resiliency unicorn ensuring enterprise backup, ransomware recovery, and disaster recovery.',
          location: 'Pune, Maharashtra, India',
          industry: 'Cloud Storage & Cyber Resiliency',
          size: '1000+ employees',
        },
      },
    },
    include: { company: true },
  });

  // 6. MUMBAI COMPANIES
  const recruiterZepto = await prisma.user.create({
    data: {
      email: 'recruiter.zepto@demo.com',
      name: 'Kabir Mehta',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'Zepto',
          logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=128&auto=format&fit=crop&q=80',
          website: 'https://zepto.com',
          description: 'Fastest-growing 10-minute grocery delivery unicorn transforming Indian urban supply chain and dark-store automation.',
          location: 'Mumbai, Maharashtra, India',
          industry: 'Quick Commerce & Logistics Tech',
          size: '1000-2000 employees',
        },
      },
    },
    include: { company: true },
  });

  const recruiterBookMyShow = await prisma.user.create({
    data: {
      email: 'recruiter.bookmyshow@demo.com',
      name: 'Natasha Dsouza',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'BookMyShow',
          logoUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=128&auto=format&fit=crop&q=80',
          website: 'https://bookmyshow.com',
          description: 'Entertainment ticketing destination managing millions of concert, sports, and cinema bookings simultaneously.',
          location: 'Mumbai, Maharashtra, India',
          industry: 'Entertainment Tech & Ticketing',
          size: '1000+ employees',
        },
      },
    },
    include: { company: true },
  });

  // 7. REMOTE INDIA COMPANIES
  const recruiterPostman = await prisma.user.create({
    data: {
      email: 'recruiter.postman@demo.com',
      name: 'Vikram Sengupta',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'Postman',
          logoUrl: 'https://images.unsplash.com/photo-1618788372246-79faff0c3742?w=128&auto=format&fit=crop&q=80',
          website: 'https://postman.com',
          description: 'The global standard API platform used by over 30 million developers to design, build, and test APIs.',
          location: 'Remote (India)',
          industry: 'Developer Tools & API Ecosystem',
          size: '1000+ employees',
        },
      },
    },
    include: { company: true },
  });

  // 8. CREATE DEMO STUDENTS
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@demo.com',
      name: 'Alex Chen',
      passwordHash: commonPassword,
      role: Role.STUDENT,
      studentProfile: {
        create: {
          headline: 'Junior Computer Science Major at UC Berkeley | Full-Stack & Systems Enthusiast',
          bio: 'Passionate software engineering student with hands-on experience building distributed systems in TypeScript, Go, and React.',
          skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'Docker', 'Go', 'Python'],
          resumeUrl: 'https://alexchen.dev/resume.pdf',
          linkedinUrl: 'https://linkedin.com/in/alexchen-demo',
          githubUrl: 'https://github.com/alexchen-demo',
          portfolioUrl: 'https://alexchen.dev',
          education: {
            create: [
              {
                degree: 'Bachelor of Science',
                institution: 'University of California, Berkeley',
                fieldOfStudy: 'Computer Science',
                startYear: 2023,
                endYear: 2027,
              },
            ],
          },
        },
      },
    },
    include: { studentProfile: { include: { education: true } } },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'priya.sharma@demo.com',
      name: 'Priya Sharma',
      passwordHash: commonPassword,
      role: Role.STUDENT,
      studentProfile: {
        create: {
          headline: 'Final Year CS Student at IIT Delhi | ML Researcher & Python Developer',
          bio: 'Undergraduate researcher focusing on NLP transformer fine-tuning, computer vision, and distributed deep learning.',
          skills: ['Python', 'PyTorch', 'TensorFlow', 'PostgreSQL', 'FastAPI', 'Docker', 'Data Science', 'AI/ML'],
          resumeUrl: 'https://priyasharma.me/cv.pdf',
          githubUrl: 'https://github.com/priyasharma-demo',
          education: {
            create: [
              {
                degree: 'B.Tech',
                institution: 'Indian Institute of Technology, Delhi',
                fieldOfStudy: 'Computer Science & Engineering',
                startYear: 2021,
                endYear: 2025,
              },
            ],
          },
        },
      },
    },
    include: { studentProfile: true },
  });

  const student3 = await prisma.user.create({
    data: {
      email: 'jordan.taylor@demo.com',
      name: 'Jordan Taylor',
      passwordHash: commonPassword,
      role: Role.STUDENT,
      studentProfile: {
        create: {
          headline: 'Human-Computer Interaction & Product Design Student at University of Washington',
          bio: 'Designing intuitive, accessible product experiences with Figma, design systems, and rapid web prototyping.',
          skills: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'HTML/CSS', 'React', 'Prototyping'],
          portfolioUrl: 'https://jordantaylor.design',
          education: {
            create: [
              {
                degree: 'Bachelor of Science',
                institution: 'University of Washington',
                fieldOfStudy: 'Human Centered Design & Engineering',
                startYear: 2022,
                endYear: 2026,
              },
            ],
          },
        },
      },
    },
    include: { studentProfile: true },
  });

  // 9. CREATE 45+ REALISTIC INTERNSHIPS (5-10 PER CITY)
  const now = new Date();
  const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const internshipsData = [
    // ----------------------------------------------------
    // BENGALURU, INDIA (10 Jobs)
    // ----------------------------------------------------
    {
      companyId: recruiterRazorpay.company!.id,
      title: 'Backend Engineering Intern - Core Payments Engine',
      description: 'Architect and scale the core transaction processing platform that handles over 40% of all digital payments across India. Build highly concurrent microservices, idempotency state machines, and low-latency Redis caching tiers.',
      responsibilities: [
        'Develop mission-critical payment integration pipelines in Go and Node.js',
        'Design idempotent state machines to handle payment callbacks and settlements',
        'Write benchmark tests and optimize query performance on distributed database clusters',
      ],
      requirements: [
        'Strong grasp of Data Structures, Algorithms, and Object-Oriented or Functional programming',
        'Hands-on experience with Go, Java, or Node.js, and relational databases (PostgreSQL)',
      ],
      skills: ['Go', 'Node.js', 'PostgreSQL', 'Redis', 'Kafka', 'Docker'],
      location: 'Bengaluru, India',
      workMode: WorkMode.HYBRID,
      stipend: 65000,
      durationMonths: 6,
      deadline: daysFromNow(30),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterRazorpay.company!.id,
      title: 'Frontend Platform Intern - Modern Checkout UX',
      description: 'Re-imagine the iconic Razorpay Standard Checkout modal utilized by 100M+ Indian consumers every month. Optimize bundle sizes under 40kb and ensure sub-second interactive speeds.',
      responsibilities: [
        'Build lightning-fast interactive web experiences using React, TypeScript, and TailwindCSS',
        'Optimize Core Web Vitals and asset delivery over edge CDNs',
      ],
      requirements: [
        'Proficiency in JavaScript (ES6+), TypeScript, React, and modern CSS/TailwindCSS',
        'Keen eye for UI detail and micro-interactions',
      ],
      skills: ['React', 'TypeScript', 'TailwindCSS', 'Next.js', 'Web Performance'],
      location: 'Bengaluru, India',
      workMode: WorkMode.REMOTE,
      stipend: 50000,
      durationMonths: 3,
      deadline: daysFromNow(22),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterRazorpay.company!.id,
      title: 'Data Platform & Analytics Engineering Intern',
      description: 'Develop real-time financial auditing pipelines and fraud analytics dashboards processing millions of events per hour using Spark and Snowflake.',
      responsibilities: [
        'Build automated ETL pipelines in Python and Apache Airflow',
        'Write high-efficiency analytical SQL queries for fraud detection teams',
      ],
      requirements: ['Strong SQL skills and Python fluency', 'Interest in big data systems'],
      skills: ['Python', 'SQL', 'PostgreSQL', 'Data Engineering', 'Docker'],
      location: 'Bengaluru, India',
      workMode: WorkMode.ONSITE,
      stipend: 55000,
      durationMonths: 6,
      deadline: daysFromNow(28),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterSwiggy.company!.id,
      title: 'Machine Learning & Search Ranking Intern',
      description: 'Tackle complex real-time search, query understanding, and personalized restaurant ranking algorithms serving tens of millions of daily orders across 500+ Indian cities.',
      responsibilities: [
        'Build and evaluate two-tower neural retrieval models and learning-to-rank algorithms',
        'Train NLP tokenizers for multilingual Indian search queries',
      ],
      requirements: ['Solid background in Machine Learning, PyTorch, and linear algebra', 'Fluency in Python and SQL'],
      skills: ['Python', 'PyTorch', 'Machine Learning', 'AI/ML', 'SQL', 'FastAPI'],
      location: 'Bengaluru, India',
      workMode: WorkMode.HYBRID,
      stipend: 80000,
      durationMonths: 6,
      deadline: daysFromNow(35),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterSwiggy.company!.id,
      title: 'Mobile App Engineering Intern (Android / React Native)',
      description: 'Craft frictionless delivery tracking, live GPS animations, and lightning-fast checkout experiences for the Swiggy consumer app on millions of Android devices.',
      responsibilities: [
        'Develop modular app features using Kotlin, Jetpack Compose, or React Native',
        'Optimize battery efficiency and smooth 60fps animations',
      ],
      requirements: ['Familiarity with Kotlin, Java, or React Native/TypeScript', 'Understanding of REST APIs'],
      skills: ['Kotlin', 'Android', 'React Native', 'TypeScript', 'Mobile'],
      location: 'Bengaluru, India',
      workMode: WorkMode.ONSITE,
      stipend: 55000,
      durationMonths: 4,
      deadline: daysFromNow(28),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterSwiggy.company!.id,
      title: 'Backend Systems Intern - Order Dispatch AI',
      description: 'Build low-latency delivery batching and partner routing microservices handling surge traffic spikes during peak Indian lunch and dinner hours.',
      responsibilities: [
        'Implement resilient Go microservices with Kafka message streaming',
        'Benchmark load and optimize Redis geospatial queries',
      ],
      requirements: ['Proficiency in Go, Java, or C++', 'Knowledge of distributed caching'],
      skills: ['Go', 'Kafka', 'Redis', 'PostgreSQL', 'Microservices'],
      location: 'Bengaluru, India',
      workMode: WorkMode.HYBRID,
      stipend: 65000,
      durationMonths: 6,
      deadline: daysFromNow(42),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterCRED.company!.id,
      title: 'Product Design & Design Systems Intern',
      description: 'Join the legendary CRED design team to craft boundary-pushing financial products, fluid micro-interactions, neo-brutalist interfaces, and scalable design tokens.',
      responsibilities: [
        'Design high-fidelity user flows, wireframes, and prototypes in Figma',
        'Create interactive component specifications for engineering handoff',
      ],
      requirements: ['Mastery of Figma (auto-layout, components, variants)', 'Obsession with typography and motion'],
      skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping', 'User Research'],
      location: 'Bengaluru, India',
      workMode: WorkMode.ONSITE,
      stipend: 60000,
      durationMonths: 4,
      deadline: daysFromNow(15),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterCRED.company!.id,
      title: 'Backend Distributed Systems Intern',
      description: 'Engineer high-throughput member reward engines, credit score tracking pipelines, and high-concurrency event-driven microservices.',
      responsibilities: [
        'Implement resilient Java / Spring Boot services deployed on AWS EKS clusters',
        'Design asynchronous job workers and real-time ledger streams using Apache Kafka',
      ],
      requirements: ['Strong problem-solving in Core Java or Go', 'Understanding of concurrency and SQL indexing'],
      skills: ['Java', 'Spring Boot', 'Kafka', 'Redis', 'AWS', 'PostgreSQL'],
      location: 'Bengaluru, India',
      workMode: WorkMode.HYBRID,
      stipend: 70000,
      durationMonths: 6,
      deadline: daysFromNow(45),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterCRED.company!.id,
      title: 'Security Engineering Intern - Cloud PenTesting',
      description: 'Audit cloud identity perimeters, perform vulnerability fuzzing on backend payment APIs, and automate CI/CD static security scanning.',
      responsibilities: [
        'Perform security evaluations on AWS IAM policies and Kubernetes ingress controllers',
        'Build automated security scanners using Python',
      ],
      requirements: ['Understanding of OWASP Top 10, network protocols, and Linux security'],
      skills: ['Security', 'Python', 'AWS', 'Linux', 'Docker'],
      location: 'Bengaluru, India',
      workMode: WorkMode.ONSITE,
      stipend: 55000,
      durationMonths: 3,
      deadline: daysFromNow(20),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterSarvam.company!.id,
      title: 'Generative AI & Multilingual LLM Research Intern',
      description: 'Work at the bleeding edge of Indian Generative AI. Train, evaluate, and fine-tune large language models and speech-to-text architectures across 22 Indian languages.',
      responsibilities: [
        'Fine-tune transformer models using PyTorch, DeepSpeed, and FlashAttention',
        'Curate, clean, and tokenize speech corpora in Hindi, Tamil, and Telugu',
      ],
      requirements: ['Deep understanding of Transformers (Hugging Face) and PyTorch', 'NLP background'],
      skills: ['Python', 'PyTorch', 'AI/ML', 'Transformers', 'Hugging Face', 'CUDA'],
      location: 'Bengaluru, India',
      workMode: WorkMode.HYBRID,
      stipend: 100000,
      durationMonths: 6,
      deadline: daysFromNow(20),
      status: InternshipStatus.PUBLISHED,
    },

    // ----------------------------------------------------
    // HYDERABAD, TELANGANA (7 Jobs)
    // ----------------------------------------------------
    {
      companyId: recruiterDarwinbox.company!.id,
      title: 'Full Stack Software Engineer Intern',
      description: 'Build enterprise HR workflows, attendance geofencing modules, and modern employee self-service web apps used by over 2 million global employees.',
      responsibilities: [
        'Develop responsive web interfaces in React and Node.js',
        'Design scalable database tables in PostgreSQL and write unit tests',
      ],
      requirements: ['Strong foundation in JavaScript/TypeScript, React, and backend REST APIs'],
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
      location: 'Hyderabad, India',
      workMode: WorkMode.HYBRID,
      stipend: 45000,
      durationMonths: 6,
      deadline: daysFromNow(25),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterDarwinbox.company!.id,
      title: 'Product Management & Growth Intern',
      description: 'Collaborate with engineering and enterprise clients to define product requirement documents (PRDs) for automated payroll and performance management.',
      responsibilities: [
        'Conduct customer discovery interviews and map user feedback to engineering tickets',
        'Analyze onboarding funnel metrics using Mixpanel and SQL',
      ],
      requirements: ['Excellent communication, analytical thinking, and wireframing skills'],
      skills: ['Product', 'SQL', 'Figma', 'Analytics', 'Agile'],
      location: 'Hyderabad, India',
      workMode: WorkMode.ONSITE,
      stipend: 40000,
      durationMonths: 4,
      deadline: daysFromNow(18),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterDarwinbox.company!.id,
      title: 'Cloud DevOps & Site Reliability Intern',
      description: 'Automate AWS multi-tenant deployments, Terraform modules, and Grafana alerting for high-availability enterprise services.',
      responsibilities: [
        'Maintain Docker containers and Kubernetes clusters on AWS EKS',
        'Improve deployment cycle time in GitLab CI/CD',
      ],
      requirements: ['Familiarity with Linux OS, Docker, and shell scripting'],
      skills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'Terraform'],
      location: 'Hyderabad, India',
      workMode: WorkMode.ONSITE,
      stipend: 48000,
      durationMonths: 6,
      deadline: daysFromNow(32),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterHighRadius.company!.id,
      title: 'AI & Data Science Intern - Autonomous Finance',
      description: 'Build machine learning models to predict corporate invoice payment delays, credit risks, and treasury cash inflows for Fortune 1000 enterprises.',
      responsibilities: [
        'Develop gradient boosting and LSTM models for financial time-series forecasting',
        'Package ML inference endpoints into Dockerized FastAPI microservices',
      ],
      requirements: ['Strong Python coding skills, Scikit-learn, and Pandas', 'Knowledge of statistical modeling'],
      skills: ['Python', 'Machine Learning', 'Data Science', 'FastAPI', 'SQL'],
      location: 'Hyderabad, India',
      workMode: WorkMode.HYBRID,
      stipend: 50000,
      durationMonths: 6,
      deadline: daysFromNow(28),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterHighRadius.company!.id,
      title: 'Backend Platform Engineer Intern - Java Microservices',
      description: 'Scale financial ledger processing systems handling millions of corporate transaction reconciliations each month.',
      responsibilities: [
        'Write robust Core Java / Spring Boot endpoints with clean unit test coverage',
        'Optimize MySQL and PostgreSQL indexing for sub-second query latency',
      ],
      requirements: ['Good understanding of Object-Oriented Design and relational databases'],
      skills: ['Java', 'Spring Boot', 'MySQL', 'PostgreSQL', 'Docker'],
      location: 'Hyderabad, India',
      workMode: WorkMode.ONSITE,
      stipend: 45000,
      durationMonths: 6,
      deadline: daysFromNow(34),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterHighRadius.company!.id,
      title: 'UI/UX Frontend Engineer Intern',
      description: 'Develop enterprise analytics dashboards with interactive data visualizations, charting widgets, and real-time cash flow monitors.',
      responsibilities: [
        'Build modular charting components using React, TypeScript, and D3/Recharts',
        'Ensure smooth 60fps rendering of data tables with 100,000+ rows',
      ],
      requirements: ['Experience with React, TypeScript, and state management'],
      skills: ['React', 'TypeScript', 'TailwindCSS', 'CSS', 'Charts'],
      location: 'Hyderabad, India',
      workMode: WorkMode.HYBRID,
      stipend: 42000,
      durationMonths: 4,
      deadline: daysFromNow(21),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterDarwinbox.company!.id,
      title: 'QA & Test Automation Intern',
      description: 'Design automated regression test suites using Playwright, Cypress, and Selenium for mission-critical enterprise workflows.',
      responsibilities: [
        'Write end-to-end integration tests in TypeScript and Python',
        'Integrate automated tests into continuous deployment pipelines',
      ],
      requirements: ['Knowledge of automated web testing tools and browser debugging'],
      skills: ['TypeScript', 'Testing', 'Python', 'Docker', 'CI/CD'],
      location: 'Hyderabad, India',
      workMode: WorkMode.ONSITE,
      stipend: 38000,
      durationMonths: 3,
      deadline: daysFromNow(15),
      status: InternshipStatus.PUBLISHED,
    },

    // ----------------------------------------------------
    // DELHI NCR / GURUGRAM / NOIDA (7 Jobs)
    // ----------------------------------------------------
    {
      companyId: recruiterZomato.company!.id,
      title: 'Full Stack Software Engineer Intern',
      description: 'Build high-performance merchant dashboards and consumer web interfaces for Zomato dining and live events platforms.',
      responsibilities: [
        'Develop interactive React web apps and internal merchant analytics tools',
        'Build performant backend APIs in Node.js and Python with robust unit tests',
      ],
      requirements: ['Good understanding of JavaScript, React, Node.js, and SQL'],
      skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'TailwindCSS'],
      location: 'Gurugram, India',
      workMode: WorkMode.ONSITE,
      stipend: 50000,
      durationMonths: 4,
      deadline: daysFromNow(18),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterZomato.company!.id,
      title: 'Data Analytics & Growth Engineering Intern',
      description: 'Analyze hyper-local customer retention, delivery times, and discount campaign ROIs across 50+ tier-1 Indian cities.',
      responsibilities: [
        'Build automated SQL queries and Tableau/PowerBI dashboards for city managers',
        'Run statistical hypothesis tests on customer churn behavior',
      ],
      requirements: ['Strong SQL querying and Python data analytics skills'],
      skills: ['SQL', 'Python', 'Data Science', 'Statistics', 'Analytics'],
      location: 'Gurugram, India',
      workMode: WorkMode.HYBRID,
      stipend: 42000,
      durationMonths: 3,
      deadline: daysFromNow(24),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterZomato.company!.id,
      title: 'iOS App Development Intern (Swift)',
      description: 'Craft fluid, haptic-enabled dining discovery flows and instant table reservation features for Zomato iOS app.',
      responsibilities: [
        'Build native iOS views in Swift and SwiftUI',
        'Optimize image caching and offline network resilience',
      ],
      requirements: ['Familiarity with Swift, Xcode, and Apple Human Interface Guidelines'],
      skills: ['Swift', 'iOS', 'Mobile', 'SwiftUI', 'REST'],
      location: 'Gurugram, India',
      workMode: WorkMode.ONSITE,
      stipend: 48000,
      durationMonths: 6,
      deadline: daysFromNow(30),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterPaytm.company!.id,
      title: 'Backend Engineering Intern - UPI & QR Platform',
      description: 'Work on India’s most ubiquitous UPI payment processing backbone handling thousands of transactions per second with zero latency spikes.',
      responsibilities: [
        'Develop high-throughput Java / Go microservices with Kafka message queues',
        'Optimize Redis caches and PostgreSQL database read-replicas',
      ],
      requirements: ['Strong computer science fundamentals, data structures, and algorithms'],
      skills: ['Java', 'Go', 'Kafka', 'Redis', 'PostgreSQL'],
      location: 'Noida, India',
      workMode: WorkMode.HYBRID,
      stipend: 50000,
      durationMonths: 6,
      deadline: daysFromNow(33),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterPaytm.company!.id,
      title: 'Fraud Risk & ML Modeling Intern',
      description: 'Develop anomaly detection algorithms to identify suspicious payment patterns, merchant chargeback fraud, and identity spoofing in real time.',
      responsibilities: [
        'Train XGBoost and Random Forest classifiers on transaction graphs',
        'Evaluate model precision, recall, and false positive rates on production streams',
      ],
      requirements: ['Fluency in Python, Scikit-learn, and SQL database querying'],
      skills: ['Python', 'Machine Learning', 'AI/ML', 'SQL', 'Algorithms'],
      location: 'Noida, India',
      workMode: WorkMode.ONSITE,
      stipend: 45000,
      durationMonths: 4,
      deadline: daysFromNow(22),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterPaytm.company!.id,
      title: 'Soundbox IoT & Firmware Software Intern',
      description: 'Program embedded Linux soundbox devices used by millions of Indian shopkeepers for instant voice payment confirmations.',
      responsibilities: [
        'Write efficient C/C++ network client daemons for low-power IoT hardware',
        'Benchmark audio codec compression and cellular network re-connection routines',
      ],
      requirements: ['Familiarity with C/C++, Linux system programming, and serial protocols'],
      skills: ['C++', 'Linux', 'Embedded', 'IoT', 'Networking'],
      location: 'Noida, India',
      workMode: WorkMode.ONSITE,
      stipend: 42000,
      durationMonths: 6,
      deadline: daysFromNow(29),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterPaytm.company!.id,
      title: 'Frontend React Engineering Intern',
      description: 'Build fast web portals for merchant settlements, tax invoices, and payment gateway onboarding.',
      responsibilities: [
        'Develop responsive web views with React, TypeScript, and modern styling libraries',
        'Implement form validation with Zod and clean state management',
      ],
      requirements: ['Proficiency in React and modern JavaScript/TypeScript'],
      skills: ['React', 'TypeScript', 'TailwindCSS', 'Next.js', 'HTML/CSS'],
      location: 'Noida, India',
      workMode: WorkMode.HYBRID,
      stipend: 40000,
      durationMonths: 3,
      deadline: daysFromNow(16),
      status: InternshipStatus.PUBLISHED,
    },

    // ----------------------------------------------------
    // PUNE, MAHARASHTRA (6 Jobs)
    // ----------------------------------------------------
    {
      companyId: recruiterIcertis.company!.id,
      title: 'Generative AI & Contract NLP Intern',
      description: 'Build automated contract clause analysis and risk assessment tools utilizing Azure OpenAI LLMs, RAG vector search, and LangChain.',
      responsibilities: [
        'Build document chunking, embedding generation, and vector retrieval pipelines',
        'Benchmark prompt engineering strategies for legal and compliance accuracy',
      ],
      requirements: ['Experience with Python, LangChain, vector databases (Pinecone/Milvus), and LLM APIs'],
      skills: ['Python', 'AI/ML', 'Transformers', 'FastAPI', 'Vector Search'],
      location: 'Pune, India',
      workMode: WorkMode.HYBRID,
      stipend: 55000,
      durationMonths: 6,
      deadline: daysFromNow(28),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterIcertis.company!.id,
      title: 'Cloud Software Engineering Intern (.NET / React)',
      description: 'Scale multi-tenant enterprise contract management modules deployed on Microsoft Azure cloud infrastructure.',
      responsibilities: [
        'Develop backend RESTful APIs using C# and .NET Core',
        'Build modular UI components in React and TypeScript',
      ],
      requirements: ['Hands-on experience with C#, Java, or TypeScript', 'Understanding of relational databases'],
      skills: ['React', 'TypeScript', 'Azure', 'SQL', 'C#'],
      location: 'Pune, India',
      workMode: WorkMode.ONSITE,
      stipend: 45000,
      durationMonths: 6,
      deadline: daysFromNow(35),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterIcertis.company!.id,
      title: 'Enterprise Product Design Intern',
      description: 'Create clear, intuitive dashboards that simplify complex enterprise legal workflows and multi-stakeholder contract sign-offs.',
      responsibilities: [
        'Design wireframes and interactive prototypes in Figma',
        'Conduct usability walkthroughs with enterprise customer success teams',
      ],
      requirements: ['Proficiency in Figma and component-based design systems'],
      skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping'],
      location: 'Pune, India',
      workMode: WorkMode.HYBRID,
      stipend: 40000,
      durationMonths: 4,
      deadline: daysFromNow(20),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterDruva.company!.id,
      title: 'Distributed Cloud Storage Systems Intern',
      description: 'Engineer high-throughput deduplication engines and object storage pipelines backing petabytes of enterprise cloud backups.',
      responsibilities: [
        'Write high-performance concurrent code in Go and C++',
        'Optimize memory buffers and AWS S3 multi-part upload throughput',
      ],
      requirements: ['Strong systems programming fundamentals in Go, C, or C++', 'Linux OS knowledge'],
      skills: ['Go', 'C++', 'Linux', 'AWS', 'Distributed Systems'],
      location: 'Pune, India',
      workMode: WorkMode.HYBRID,
      stipend: 50000,
      durationMonths: 6,
      deadline: daysFromNow(38),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterDruva.company!.id,
      title: 'Cloud Security & Ransomware Detection Intern',
      description: 'Develop automated behavioral analysis heuristics to detect anomalous file encryption patterns signaling ransomware attacks.',
      responsibilities: [
        'Build automated security inspection scripts in Python',
        'Analyze audit logs and cloud event telemetry streams',
      ],
      requirements: ['Interest in cybersecurity, operating system internals, and Python scripting'],
      skills: ['Security', 'Python', 'Linux', 'Docker', 'AWS'],
      location: 'Pune, India',
      workMode: WorkMode.ONSITE,
      stipend: 48000,
      durationMonths: 4,
      deadline: daysFromNow(26),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterDruva.company!.id,
      title: 'Full Stack Web Developer Intern',
      description: 'Create intuitive cloud backup administration consoles with real-time health monitors, recovery wizards, and role-based permissions.',
      responsibilities: [
        'Build frontend pages in React, TypeScript, and modern CSS',
        'Connect with GraphQL and REST backend services',
      ],
      requirements: ['Proficiency in React and TypeScript', 'Familiarity with Git'],
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
      location: 'Pune, India',
      workMode: WorkMode.HYBRID,
      stipend: 44000,
      durationMonths: 3,
      deadline: daysFromNow(19),
      status: InternshipStatus.PUBLISHED,
    },

    // ----------------------------------------------------
    // MUMBAI, MAHARASHTRA (6 Jobs)
    // ----------------------------------------------------
    {
      companyId: recruiterZepto.company!.id,
      title: 'Cloud Infrastructure & SRE Intern',
      description: 'Maintain the ultra-reliable cloud infrastructure supporting Zepto 10-minute delivery networks, dark store robotics, and real-time picker apps.',
      responsibilities: [
        'Configure Kubernetes deployments, Ingress controllers, and auto-scaling rules on AWS',
        'Automate cloud infrastructure using Terraform and Ansible',
      ],
      requirements: ['Familiarity with Linux, Docker containers, and shell scripting'],
      skills: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'Terraform'],
      location: 'Mumbai, India',
      workMode: WorkMode.HYBRID,
      stipend: 60000,
      durationMonths: 6,
      deadline: daysFromNow(32),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterZepto.company!.id,
      title: 'Supply Chain Optimization & Algorithm Intern',
      description: 'Develop linear programming and vehicle routing algorithms to optimize grocery replenishment schedules between central warehouses and dark stores.',
      responsibilities: [
        'Formulate mathematical optimization models using Python and OR-Tools',
        'Analyze inventory waste reduction and stockout metrics',
      ],
      requirements: ['Strong math background, operations research, or algorithms', 'Python coding skills'],
      skills: ['Python', 'Algorithms', 'Data Science', 'SQL', 'Optimization'],
      location: 'Mumbai, India',
      workMode: WorkMode.ONSITE,
      stipend: 55000,
      durationMonths: 4,
      deadline: daysFromNow(23),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterZepto.company!.id,
      title: 'Android Engineering Intern (Kotlin)',
      description: 'Build instant item scanning, picker route navigation, and shelf auditing features for the Zepto dark store worker app.',
      responsibilities: [
        'Develop native Android features using Kotlin and Jetpack Compose',
        'Optimize barcode camera scanning latency and offline cache sync',
      ],
      requirements: ['Experience with Kotlin and Android SDK', 'Knowledge of REST APIs'],
      skills: ['Kotlin', 'Android', 'Mobile', 'Git', 'SQLite'],
      location: 'Mumbai, India',
      workMode: WorkMode.ONSITE,
      stipend: 50000,
      durationMonths: 6,
      deadline: daysFromNow(27),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterBookMyShow.company!.id,
      title: 'High-Scale Ticketing Backend Intern',
      description: 'Build distributed reservation locks and flash-sale queue management systems capable of selling out 100,000 stadium concert tickets in minutes.',
      responsibilities: [
        'Develop resilient Go / Java microservices with Redis distributed mutexes',
        'Stress-test API endpoints against simulated DDOS traffic',
      ],
      requirements: ['Strong understanding of concurrency, databases, and microservices'],
      skills: ['Go', 'Java', 'Redis', 'PostgreSQL', 'Microservices'],
      location: 'Mumbai, India',
      workMode: WorkMode.HYBRID,
      stipend: 48000,
      durationMonths: 6,
      deadline: daysFromNow(36),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterBookMyShow.company!.id,
      title: 'Frontend Performance & Web UX Intern',
      description: 'Optimize interactive cinema seat-layout selectors and live event seat maps for smooth 60fps zooming and panning across mobile browsers.',
      responsibilities: [
        'Build performant SVG / Canvas seat rendering engines in React and TypeScript',
        'Optimize web bundle sizes and asset delivery',
      ],
      requirements: ['Proficiency in React, HTML5 Canvas/SVG, and TypeScript'],
      skills: ['React', 'TypeScript', 'TailwindCSS', 'Web Performance', 'Next.js'],
      location: 'Mumbai, India',
      workMode: WorkMode.ONSITE,
      stipend: 42000,
      durationMonths: 3,
      deadline: daysFromNow(17),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterBookMyShow.company!.id,
      title: 'Data Analytics & Recommendation Intern',
      description: 'Analyze entertainment attendance trends, artist popularity metrics, and personalized movie recommendations for millions of active moviegoers.',
      responsibilities: [
        'Write complex SQL queries on analytical data warehouses',
        'Build customer segmentation models using Python',
      ],
      requirements: ['Good understanding of SQL, Python, and exploratory data analysis'],
      skills: ['Python', 'SQL', 'Data Science', 'PostgreSQL', 'Analytics'],
      location: 'Mumbai, India',
      workMode: WorkMode.HYBRID,
      stipend: 40000,
      durationMonths: 4,
      deadline: daysFromNow(25),
      status: InternshipStatus.PUBLISHED,
    },

    // ----------------------------------------------------
    // REMOTE (INDIA) (6 Jobs)
    // ----------------------------------------------------
    {
      companyId: recruiterPostman.company!.id,
      title: 'API Tooling & Developer Experience Intern',
      description: 'Build open-source CLI tools, mock servers, and interactive API documentation renderers used daily by tens of millions of engineers worldwide.',
      responsibilities: [
        'Contribute to TypeScript and Node.js developer tooling libraries',
        'Design intuitive developer workflow commands and automated test harnesses',
      ],
      requirements: ['Deep passion for developer tools, APIs, and open-source software', 'TypeScript fluency'],
      skills: ['TypeScript', 'Node.js', 'React', 'Docker', 'API Design'],
      location: 'Remote (India)',
      workMode: WorkMode.REMOTE,
      stipend: 65000,
      durationMonths: 6,
      deadline: daysFromNow(30),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterPostman.company!.id,
      title: 'Technical Content & Developer Relations Intern',
      description: 'Write comprehensive technical tutorials, API design guides, and demo applications showcasing modern GraphQL and gRPC workflows.',
      responsibilities: [
        'Create technical blog posts, sample GitHub repositories, and interactive API collections',
        'Engage with student developer communities and hackathon participants',
      ],
      requirements: ['Strong technical writing skills and curiosity about software development'],
      skills: ['Technical Writing', 'JavaScript', 'Python', 'API Design', 'Git'],
      location: 'Remote (India)',
      workMode: WorkMode.REMOTE,
      stipend: 40000,
      durationMonths: 3,
      deadline: daysFromNow(14),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterPostman.company!.id,
      title: 'Open Source Systems Engineering Intern',
      description: 'Contribute to distributed HTTP proxy engines, automated contract testing suites, and performance profiling tools.',
      responsibilities: [
        'Write high-performance network handling routines in Go or Rust',
        'Profile memory allocations and optimize benchmark speeds',
      ],
      requirements: ['Solid understanding of HTTP/2, WebSockets, and low-level networking in Go or Rust'],
      skills: ['Go', 'Rust', 'Networking', 'Linux', 'Docker'],
      location: 'Remote (India)',
      workMode: WorkMode.REMOTE,
      stipend: 75000,
      durationMonths: 6,
      deadline: daysFromNow(40),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiter4.company!.id,
      title: 'Full-Stack Developer Tooling Intern',
      description: 'Build open-source CLI tools, VS Code extensions, and web dashboards that help developers test and deploy microservices 10x faster.',
      responsibilities: [
        'Develop web frontend views using React, TypeScript, and TailwindCSS',
        'Implement background test execution workers in Go and Node.js',
      ],
      requirements: ['Experience building full-stack web applications with React and Node.js'],
      skills: ['TypeScript', 'React', 'Node.js', 'Go', 'Docker'],
      location: 'Remote (India)',
      workMode: WorkMode.REMOTE,
      stipend: 45000,
      durationMonths: 3,
      deadline: daysFromNow(26),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterSarvam.company!.id,
      title: 'Indic Speech AI & Acoustic Modeling Intern',
      description: 'Train cutting-edge automatic speech recognition (ASR) and text-to-speech (TTS) models across diverse Indian regional accents and dialects.',
      responsibilities: [
        'Pre-process audio waveforms and align phonetic transcripts using Python and PyTorch',
        'Evaluate word error rates (WER) across Indian languages',
      ],
      requirements: ['Knowledge of digital signal processing and deep learning with PyTorch'],
      skills: ['Python', 'PyTorch', 'AI/ML', 'Speech Processing', 'Deep Learning'],
      location: 'Remote (India)',
      workMode: WorkMode.REMOTE,
      stipend: 90000,
      durationMonths: 6,
      deadline: daysFromNow(31),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterRazorpay.company!.id,
      title: 'Remote Documentation & UI Polish Intern',
      description: 'Craft beautiful developer docs, interactive API playgrounds, and code recipes for Razorpay developer hub.',
      responsibilities: [
        'Build interactive Markdown/MDX component renderers in Next.js',
        'Write code snippets in Python, Node.js, PHP, and Java for checkout integrations',
      ],
      requirements: ['Familiarity with React, Next.js, and technical writing'],
      skills: ['React', 'Next.js', 'TypeScript', 'Technical Writing', 'Git'],
      location: 'Remote (India)',
      workMode: WorkMode.REMOTE,
      stipend: 45000,
      durationMonths: 3,
      deadline: daysFromNow(21),
      status: InternshipStatus.PUBLISHED,
    },

    // ----------------------------------------------------
    // GLOBAL / US OPENINGS (Retained for test consistency)
    // ----------------------------------------------------
    {
      companyId: recruiterUser.company!.id,
      title: 'Frontend Engineering Intern (Global)',
      description: 'Join our Core UI and Design Systems team to build high-performance dashboard interfaces used by thousands of DevOps engineers.',
      responsibilities: ['Develop responsive web components using React, Next.js, and TypeScript'],
      requirements: ['Solid foundation in JavaScript/TypeScript and React'],
      skills: ['TypeScript', 'React', 'Next.js', 'TailwindCSS', 'Jest'],
      location: 'San Francisco, CA',
      workMode: WorkMode.HYBRID,
      stipend: 3200,
      durationMonths: 3,
      deadline: daysFromNow(25),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterUser.company!.id,
      title: 'Cloud Infrastructure & DevOps Intern (Global)',
      description: 'Automate Kubernetes cluster orchestration, Terraform infrastructure as code, and CI/CD pipelines across AWS and GCP regions.',
      responsibilities: ['Automate containerized microservice deployments using Kubernetes and Helm'],
      requirements: ['Hands-on experience with Linux environments, Bash scripting, and Docker'],
      skills: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'Go'],
      location: 'San Francisco, CA',
      workMode: WorkMode.REMOTE,
      stipend: 3500,
      durationMonths: 6,
      deadline: daysFromNow(40),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiter2.company!.id,
      title: 'Quantitative Research & Data Science Intern (Global)',
      description: 'Develop statistical arbitrage models and analyze high-frequency financial market microstructures.',
      responsibilities: ['Implement predictive machine learning algorithms in Python'],
      requirements: ['Strong background in probability, linear algebra, and mathematical statistics'],
      skills: ['Python', 'Data Science', 'PyTorch', 'PostgreSQL', 'Statistics'],
      location: 'New York, NY',
      workMode: WorkMode.HYBRID,
      stipend: 3800,
      durationMonths: 3,
      deadline: daysFromNow(12),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterUser.company!.id,
      title: 'Systems Security Research Intern (Winter 2024)',
      description: 'Conducted vulnerability assessments and memory-safety fuzz testing for hypervisor drivers.',
      responsibilities: ['Write AFL fuzzing harness scripts'],
      requirements: ['C/C++ knowledge'],
      skills: ['C++', 'Linux', 'Security'],
      location: 'San Francisco, CA',
      workMode: WorkMode.ONSITE,
      stipend: 3000,
      durationMonths: 3,
      deadline: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // Past deadline for verification
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterUser.company!.id,
      title: 'Lead Architect Shadowing Intern (Closed)',
      description: 'Shadow executive engineering staff on next-generation database clustering initiatives.',
      responsibilities: ['Synthesize research papers'],
      requirements: ['Distributed systems passion'],
      skills: ['Architecture', 'Distributed Systems'],
      location: 'San Francisco, CA',
      workMode: WorkMode.REMOTE,
      stipend: 3500,
      durationMonths: 3,
      deadline: daysFromNow(30),
      status: InternshipStatus.CLOSED, // Closed for verification
    },
  ];

  const createdInternships: any[] = [];
  for (const item of internshipsData) {
    const created = await prisma.internship.create({
      data: item,
    });
    createdInternships.push(created);
  }

  // 10. SAMPLE APPLICATIONS FOR LIVE PIPELINE
  await prisma.application.create({
    data: {
      studentProfileId: studentUser.studentProfile!.id,
      internshipId: createdInternships[0].id, // Razorpay
      status: ApplicationStatus.APPLIED,
      coverNote: 'Very interested in high-scale distributed payments infrastructure in Go.',
      appliedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.application.create({
    data: {
      studentProfileId: studentUser.studentProfile!.id,
      internshipId: createdInternships[43].id, // Cloud DevOps (NexusCloud)
      status: ApplicationStatus.SHORTLISTED,
      coverNote: 'Extensive Docker and Linux hands-on practice from university OS labs.',
      appliedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.application.create({
    data: {
      studentProfileId: student2.studentProfile!.id,
      internshipId: createdInternships[9].id, // Sarvam AI
      status: ApplicationStatus.INTERVIEW,
      coverNote: 'My research at IIT Delhi on Indic transformer models directly aligns with Sarvam AI mission.',
      appliedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.application.create({
    data: {
      studentProfileId: student2.studentProfile!.id,
      internshipId: createdInternships[42].id, // Frontend Engineering (NexusCloud)
      status: ApplicationStatus.APPLIED,
      coverNote: 'Looking to expand my frontend skills with a world-class team at NexusCloud.',
      appliedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.application.create({
    data: {
      studentProfileId: student3.studentProfile!.id,
      internshipId: createdInternships[6].id, // CRED Design
      status: ApplicationStatus.SELECTED,
      coverNote: 'Preview of my design systems case study tailored for modern consumer fintech.',
      appliedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('Database successfully seeded:');
  console.log(`- 1 Recruiter Demo Account: recruiter@demo.com / password123`);
  console.log(`- 1 Student Demo Account: student@demo.com / password123`);
  console.log(`- 16 Verified Tech Companies across India & Global`);
  console.log(`- ${createdInternships.length} Realistic Internships with 5-10 jobs per city:`);
  console.log(`  * Bengaluru: 10 jobs`);
  console.log(`  * Hyderabad: 7 jobs`);
  console.log(`  * Delhi NCR (Gurugram / Noida): 7 jobs`);
  console.log(`  * Pune: 6 jobs`);
  console.log(`  * Mumbai: 6 jobs`);
  console.log(`  * Remote (India): 6 jobs`);
  console.log(`  * Global / US: 5 jobs`);
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
