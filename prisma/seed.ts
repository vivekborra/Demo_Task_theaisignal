import { PrismaClient, Role, WorkMode, InternshipStatus, ApplicationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with realistic production-grade data...');

  // Clean existing records in reverse dependency order
  await prisma.application.deleteMany();
  await prisma.internship.deleteMany();
  await prisma.company.deleteMany();
  await prisma.education.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = 10;
  const commonPassword = await bcrypt.hash('password123', saltRounds);

  // 1. Create Recruiter User & Company
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

  // Additional Recruiter Users & Companies
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
          location: 'Bengaluru, India',
          industry: 'Developer Tools',
          size: '20-50 employees',
        },
      },
    },
    include: { company: true },
  });

  const recruiter5 = await prisma.user.create({
    data: {
      email: 'recruiter.cybershield@demo.com',
      name: 'Alexander Croft',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'CyberShield Security',
          logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&auto=format&fit=crop&q=80',
          website: 'https://cybershield.security',
          description: 'Zero-trust identity mesh and automated threat prevention for cloud-native infrastructure.',
          location: 'Austin, TX',
          industry: 'Cybersecurity',
          size: '100-250 employees',
        },
      },
    },
    include: { company: true },
  });

  const recruiter6 = await prisma.user.create({
    data: {
      email: 'recruiter.terrametrics@demo.com',
      name: 'Chloe Laurent',
      passwordHash: commonPassword,
      role: Role.RECRUITER,
      company: {
        create: {
          name: 'TerraMetrics Earth',
          logoUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=128&auto=format&fit=crop&q=80',
          website: 'https://terrametrics.earth',
          description: 'Satellite imagery processing and carbon offset verification engine powering sustainable corporate ESG reporting.',
          location: 'Seattle, WA',
          industry: 'ClimateTech & Geospatial',
          size: '50-100 employees',
        },
      },
    },
    include: { company: true },
  });

  // 2. Create Student Demo Account
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@demo.com',
      name: 'Alex Chen',
      passwordHash: commonPassword,
      role: Role.STUDENT,
      studentProfile: {
        create: {
          headline: 'Junior Computer Science Major at UC Berkeley | Full-Stack & Systems Enthusiast',
          bio: 'Passionate software engineering student with hands-on experience building distributed systems in TypeScript, Go, and React. Passionate about developer tooling, cloud architecture, and high-performance web applications.',
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

  // Additional Students for Recruiter Applicant Verification
  const student2 = await prisma.user.create({
    data: {
      email: 'priya.sharma@demo.com',
      name: 'Priya Sharma',
      passwordHash: commonPassword,
      role: Role.STUDENT,
      studentProfile: {
        create: {
          headline: 'Final Year CS Student at IIT Delhi | ML Researcher & Python Developer',
          bio: 'Undergraduate researcher focusing on NLP transformer fine-tuning and computer vision for autonomous perception.',
          skills: ['Python', 'PyTorch', 'TensorFlow', 'PostgreSQL', 'FastAPI', 'Docker', 'Data Science'],
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

  // 3. Create 20+ Realistic Internships
  const now = new Date();
  const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const internshipsData = [
    // NexusCloud Systems (Recruiter 1)
    {
      companyId: recruiterUser.company!.id,
      title: 'Frontend Engineering Intern',
      description: 'Join our Core UI and Design Systems team to build high-performance dashboard interfaces used by thousands of DevOps engineers. You will design, build, and optimize React/Next.js components, collaborate with product designers, and ensure high test coverage and accessibility standards.',
      responsibilities: [
        'Develop responsive web components using React, Next.js, and TypeScript',
        'Contribute to our internal open-source design system and documentation',
        'Collaborate with backend engineers to integrate RESTful and GraphQL endpoints',
        'Write robust unit and end-to-end tests using Vitest and Playwright',
        'Profile client-side bundle sizes and optimize Core Web Vitals',
      ],
      requirements: [
        'Solid foundation in JavaScript/TypeScript, React, and modern CSS/TailwindCSS',
        'Understanding of asynchronous programming, state management, and DOM manipulation',
        'Familiarity with Git version control and collaborative code reviews',
        'Currently pursuing a BS/MS in Computer Science, Software Engineering, or related field',
      ],
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
      title: 'Cloud Infrastructure & DevOps Intern',
      description: 'Work alongside our Site Reliability Engineering (SRE) group to automate Kubernetes cluster orchestration, Terraform infrastructure as code, and CI/CD pipelines across AWS and GCP multi-region regions.',
      responsibilities: [
        'Automate containerized microservice deployments using Kubernetes and Helm',
        'Develop monitoring alerts and observability dashboards in Grafana and Prometheus',
        'Improve build and deployment speed in GitHub Actions CI pipelines',
        'Investigate and document root causes for platform latency anomalies',
      ],
      requirements: [
        'Hands-on experience with Linux environments, Bash scripting, and Docker',
        'Familiarity with cloud providers (AWS, GCP, or Azure)',
        'Interest in high-availability distributed systems and network protocols',
      ],
      skills: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'Go'],
      location: 'San Francisco, CA',
      workMode: WorkMode.REMOTE,
      stipend: 3500,
      durationMonths: 6,
      deadline: daysFromNow(40),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiterUser.company!.id,
      title: 'Backend Platform Engineer Intern',
      description: 'Build robust, fault-tolerant REST and gRPC microservices in Go and Node.js that handle real-time telemetry streaming from over 10 million cloud containers.',
      responsibilities: [
        'Design and implement performant API endpoints with database indexing and query optimization',
        'Integrate Kafka and Redis pub/sub message queues for high-throughput stream processing',
        'Participate in architecture design reviews and write technical documentation',
      ],
      requirements: [
        'Proficiency in Go, Node.js, or Java',
        'Experience with relational databases (PostgreSQL/MySQL) and SQL query writing',
        'Knowledge of RESTful architecture, HTTP specs, and API security practices',
      ],
      skills: ['Go', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
      location: 'San Francisco, CA',
      workMode: WorkMode.ONSITE,
      stipend: 3400,
      durationMonths: 4,
      deadline: daysFromNow(18),
      status: InternshipStatus.PUBLISHED,
    },
    // FinPulse Technologies
    {
      companyId: recruiter2.company!.id,
      title: 'Quantitative Research & Data Science Intern',
      description: 'Develop statistical arbitrage models, analyze high-frequency market microstructures, and build automated feature engineering pipelines utilizing petabyte-scale historical financial ticks.',
      responsibilities: [
        'Perform exploratory data analysis and hypothesis testing on tick-level market data',
        'Implement predictive machine learning algorithms in Python using Scikit-Learn and PyTorch',
        'Backtest quantitative trading strategies using internal risk engines',
      ],
      requirements: [
        'Strong background in probability, linear algebra, and mathematical statistics',
        'Proficiency in Python with Pandas, NumPy, and SciPy',
        'Enrolled in STEM degree (Math, Stats, CS, Financial Engineering, or Physics)',
      ],
      skills: ['Python', 'Data Science', 'PyTorch', 'PostgreSQL', 'Statistics'],
      location: 'New York, NY',
      workMode: WorkMode.HYBRID,
      stipend: 3800,
      durationMonths: 3,
      deadline: daysFromNow(12),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiter2.company!.id,
      title: 'FinTech Backend Engineer Intern',
      description: 'Engineer high-security ledger systems, multi-currency payment rails, and real-time fraud scoring pipelines with strict sub-10ms SLA constraints.',
      responsibilities: [
        'Write transactional database schemas with strict ACID compliance in PostgreSQL',
        'Build and scale asynchronous event consumers handling payment processing',
        'Conduct rigorous penetration testing and adhere to SOC2 and PCI-DSS standards',
      ],
      requirements: [
        'Strong knowledge of TypeScript, Node.js, or Java/Kotlin',
        'Deep understanding of database isolation levels, deadlocks, and transactions',
      ],
      skills: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Security'],
      location: 'New York, NY',
      workMode: WorkMode.ONSITE,
      stipend: 3600,
      durationMonths: 3,
      deadline: daysFromNow(30),
      status: InternshipStatus.PUBLISHED,
    },
    // HealthAI Labs
    {
      companyId: recruiter3.company!.id,
      title: 'Computer Vision & Deep Learning Intern',
      description: 'Research and deploy convolutional and vision transformer architectures for automated tumor segmentation in 3D CT scans and MRI imaging.',
      responsibilities: [
        'Curate, normalize, and augment multi-modal medical imaging datasets',
        'Train and evaluate PyTorch neural networks on distributed multi-GPU clusters',
        'Publish findings and contribute to open-source medical benchmark evaluations',
      ],
      requirements: [
        'Proven coursework or project experience in Computer Vision and Deep Learning',
        'Expertise with PyTorch, OpenCV, and CUDA acceleration',
      ],
      skills: ['Python', 'PyTorch', 'Computer Vision', 'Deep Learning', 'Docker'],
      location: 'Boston, MA',
      workMode: WorkMode.REMOTE,
      stipend: 3000,
      durationMonths: 6,
      deadline: daysFromNow(22),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiter3.company!.id,
      title: 'Full-Stack HealthTech Web Developer Intern',
      description: 'Build clinician-facing web portals that display interactive 3D radiology scans and AI diagnostic summaries in real time with HIPAA compliance.',
      responsibilities: [
        'Develop responsive web interfaces with Next.js, React, and TailwindCSS',
        'Integrate WebGL and Three.js canvas renderers for DICOM 3D scans',
        'Ensure rigorous accessibility (WCAG 2.1 AA) and mobile browser responsiveness',
      ],
      requirements: [
        'Proficiency in React, TypeScript, and modern CSS',
        'Enthusiasm for solving healthcare challenges with web software',
      ],
      skills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'WebGL'],
      location: 'Boston, MA',
      workMode: WorkMode.HYBRID,
      stipend: 2800,
      durationMonths: 3,
      deadline: daysFromNow(35),
      status: InternshipStatus.PUBLISHED,
    },
    // DevOrbit Tools
    {
      companyId: recruiter4.company!.id,
      title: 'Developer Productivity Engineer Intern',
      description: 'Build command-line interfaces, VS Code extensions, and local dev environments that help thousands of developers ship software 10x faster.',
      responsibilities: [
        'Develop high-speed CLI binaries in Rust or Go',
        'Build TypeScript plugins for Visual Studio Code and JetBrains IDEs',
        'Write comprehensive developer documentation and interactive tutorials',
      ],
      requirements: [
        'Passionate about developer tooling, ergonomics, and terminal environments',
        'Familiar with Rust, Go, or TypeScript',
      ],
      skills: ['Go', 'TypeScript', 'Docker', 'CLI', 'Git'],
      location: 'Bengaluru, India',
      workMode: WorkMode.REMOTE,
      stipend: 1200,
      durationMonths: 4,
      deadline: daysFromNow(45),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiter4.company!.id,
      title: 'Product Design & UI/UX Intern',
      description: 'Design dark-mode interfaces, developer CLI mockups, and end-to-end onboarding flows for our developer productivity SaaS platform.',
      responsibilities: [
        'Create low and high fidelity wireframes and interactive prototypes in Figma',
        'Conduct usability interviews with engineers and analyze friction points',
        'Maintain and expand our unified Figma design token system',
      ],
      requirements: [
        'Strong design portfolio demonstrating clean typography, layout, and visual hierarchy',
        'Proficiency in Figma, user journey mapping, and component variant architecture',
      ],
      skills: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Prototyping'],
      location: 'Bengaluru, India',
      workMode: WorkMode.REMOTE,
      stipend: 1000,
      durationMonths: 3,
      deadline: daysFromNow(20),
      status: InternshipStatus.PUBLISHED,
    },
    // CyberShield Security
    {
      companyId: recruiter5.company!.id,
      title: 'Cybersecurity Threat Intelligence Intern',
      description: 'Analyze real-time network anomaly logs, monitor global vulnerability disclosures (CVEs), and write automated intrusion detection rules in Snort and YARA.',
      responsibilities: [
        'Triage automated alerts from endpoint detection and response (EDR) agents',
        'Simulate adversary tactics against our internal staging honeypots',
        'Author threat briefing reports for client security operations centers (SOC)',
      ],
      requirements: [
        'Solid grasp of TCP/IP networking, DNS, TLS, and common web attack vectors (OWASP Top 10)',
        'Scripting experience in Python or Bash for log analysis',
      ],
      skills: ['Cybersecurity', 'Python', 'Linux', 'Networking', 'Security'],
      location: 'Austin, TX',
      workMode: WorkMode.ONSITE,
      stipend: 2900,
      durationMonths: 3,
      deadline: daysFromNow(28),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiter5.company!.id,
      title: 'Cloud Security Engineer Intern',
      description: 'Implement automated IAM policy analyzers and cloud posture management scripts across AWS IAM, GCP Cloud Identity, and Azure Entra ID.',
      responsibilities: [
        'Audit cloud infrastructure for least-privilege permission compliance',
        'Implement automated AWS Lambda triggers to remediate open S3 buckets and security groups',
        'Collaborate with developers to integrate static code analysis (SAST) in CI/CD',
      ],
      requirements: [
        'Familiarity with AWS/Azure core services and IAM policies',
        'Basic programming skills in Python or Go',
      ],
      skills: ['AWS', 'Security', 'Python', 'Terraform', 'Docker'],
      location: 'Austin, TX',
      workMode: WorkMode.HYBRID,
      stipend: 3100,
      durationMonths: 3,
      deadline: daysFromNow(50),
      status: InternshipStatus.PUBLISHED,
    },
    // TerraMetrics Earth
    {
      companyId: recruiter6.company!.id,
      title: 'Geospatial Data Engineering Intern',
      description: 'Process gigabytes of multispectral satellite imagery daily, calculating vegetative indices (NDVI) and carbon sequestration metrics using Apache Spark and GDAL.',
      responsibilities: [
        'Build scalable raster and vector data pipelines with Python and GeoPandas',
        'Optimize geospatial queries using PostgreSQL and PostGIS extensions',
        'Deploy serverless image transformation pipelines on cloud object storage',
      ],
      requirements: [
        'Experience with Python and geospatial packages (GDAL, Rasterio, or Shapely)',
        'Understanding of relational databases and spatial data types',
      ],
      skills: ['Python', 'PostgreSQL', 'Data Science', 'Docker', 'AWS'],
      location: 'Seattle, WA',
      workMode: WorkMode.HYBRID,
      stipend: 3000,
      durationMonths: 4,
      deadline: daysFromNow(15),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiter6.company!.id,
      title: 'Product Management Intern - Climate Data',
      description: 'Define requirements for corporate ESG compliance dashboards, synthesize customer discovery interviews with sustainability officers, and prioritize sprint backlogs.',
      responsibilities: [
        'Conduct market analysis on carbon credit markets and international climate reporting standards',
        'Write clear product requirement documents (PRDs) and user stories with acceptance criteria',
        'Coordinate with design and engineering teams through weekly agile ceremonies',
      ],
      requirements: [
        'Exceptional written and oral communication skills',
        'Analytical mindset with comfort interpreting complex data metrics',
        'Passion for sustainability, climate technology, and enterprise software',
      ],
      skills: ['Product Management', 'Data Analysis', 'User Research', 'Agile', 'Figma'],
      location: 'Seattle, WA',
      workMode: WorkMode.REMOTE,
      stipend: 2500,
      durationMonths: 3,
      deadline: daysFromNow(32),
      status: InternshipStatus.PUBLISHED,
    },
    // Additional Postings for filtering & realistic edge cases
    {
      companyId: recruiterUser.company!.id,
      title: 'AI/ML Systems Platform Intern',
      description: 'Help build scalable model inference servers, GPU memory management routines, and continuous LLM evaluation pipelines for our enterprise enterprise clients.',
      responsibilities: [
        'Benchmark inference throughput for quantized open-source LLMs (Llama 3, Mistral)',
        'Implement streaming responses via Server-Sent Events (SSE) and WebSockets',
        'Monitor token latencies and manage vLLM orchestration clusters',
      ],
      requirements: [
        'Strong programming skills in Python and C++ or Rust',
        'Knowledge of Transformer architecture and inference mechanics',
      ],
      skills: ['Python', 'PyTorch', 'AI/ML', 'Docker', 'FastAPI'],
      location: 'San Francisco, CA',
      workMode: WorkMode.HYBRID,
      stipend: 3600,
      durationMonths: 6,
      deadline: daysFromNow(60),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiter2.company!.id,
      title: 'Mobile App Developer Intern (React Native)',
      description: 'Build biometric-authenticated iOS and Android mobile investment apps with real-time portfolio charts and instant order executions.',
      responsibilities: [
        'Develop cross-platform components with React Native and Expo',
        'Implement secure offline token storage and biometric unlock (FaceID/Fingerprint)',
        'Optimize high-frequency animation charts with React Native Reanimated',
      ],
      requirements: [
        'Experience with React or React Native',
        'Understanding of mobile app lifecycles and navigation patterns',
      ],
      skills: ['React Native', 'React', 'TypeScript', 'Mobile', 'TailwindCSS'],
      location: 'New York, NY',
      workMode: WorkMode.REMOTE,
      stipend: 3200,
      durationMonths: 3,
      deadline: daysFromNow(19),
      status: InternshipStatus.PUBLISHED,
    },
    {
      companyId: recruiter4.company!.id,
      title: 'Technical Content & Developer Advocate Intern',
      description: 'Create high-impact code tutorials, video breakdowns, sample GitHub repositories, and documentation that teach thousands of devs how to optimize their CI workflows.',
      responsibilities: [
        'Build and publish sample open-source projects demonstrating DevOrbit APIs',
        'Write technical blog posts and documentation guides',
        'Engage with developer communities on Discord, GitHub, and Twitter',
      ],
      requirements: [
        'Excellent technical writing and communication abilities',
        'Experience coding in JavaScript/TypeScript or Python',
      ],
      skills: ['TypeScript', 'Git', 'Technical Writing', 'DevOps', 'Community'],
      location: 'Bengaluru, India',
      workMode: WorkMode.REMOTE,
      stipend: 900,
      durationMonths: 3,
      deadline: daysFromNow(26),
      status: InternshipStatus.PUBLISHED,
    },
    // Expired Internship (for testing edge cases: applying to expired posting)
    {
      companyId: recruiterUser.company!.id,
      title: 'Legacy Systems Migration Intern (Expired Example)',
      description: 'This is a concluded internship posting used to verify that expired postings properly disable applications and display appropriate statuses.',
      responsibilities: ['Assist in archival data migration'],
      requirements: ['Knowledge of legacy databases'],
      skills: ['SQL', 'PostgreSQL'],
      location: 'San Francisco, CA',
      workMode: WorkMode.REMOTE,
      stipend: 2000,
      durationMonths: 2,
      deadline: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days in past
      status: InternshipStatus.PUBLISHED,
    },
    // Manually Closed Internship (for testing edge cases: applying to closed posting)
    {
      companyId: recruiter2.company!.id,
      title: 'Executive Assistant to VP Engineering (Closed Example)',
      description: 'This posting has been manually closed by the recruiter. Applications are not permitted.',
      responsibilities: ['Coordination and scheduling'],
      requirements: ['Organizational skills'],
      skills: ['Operations', 'Agile'],
      location: 'New York, NY',
      workMode: WorkMode.ONSITE,
      stipend: 2200,
      durationMonths: 3,
      deadline: daysFromNow(10),
      status: InternshipStatus.CLOSED,
    },
  ];

  const createdInternships = [];
  for (const item of internshipsData) {
    const internship = await prisma.internship.create({
      data: item,
    });
    createdInternships.push(internship);
  }

  // 4. Create Sample Applications for Demo Student & other students
  // Alex Chen applies to Frontend Engineering Intern at NexusCloud
  const app1 = await prisma.application.create({
    data: {
      studentProfileId: studentUser.studentProfile!.id,
      internshipId: createdInternships[0].id, // Frontend Engineering Intern (NexusCloud)
      status: ApplicationStatus.INTERVIEW,
      coverNote: 'I love NexusCloud tools and have built several dashboard projects using React and TailwindCSS. I would be thrilled to contribute to your core design systems!',
      appliedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  // Alex Chen applies to Cloud Infrastructure Intern
  const app2 = await prisma.application.create({
    data: {
      studentProfileId: studentUser.studentProfile!.id,
      internshipId: createdInternships[1].id, // Cloud DevOps Intern (NexusCloud)
      status: ApplicationStatus.SHORTLISTED,
      coverNote: 'I have extensive Docker and Linux hands-on practice from university operating systems labs.',
      appliedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
    },
  });

  // Alex Chen applies to Full-Stack HealthTech Web Dev
  const app3 = await prisma.application.create({
    data: {
      studentProfileId: studentUser.studentProfile!.id,
      internshipId: createdInternships[6].id, // HealthTech Web Dev (HealthAI Labs)
      status: ApplicationStatus.APPLIED,
      coverNote: 'Excited about the intersection of modern web interfaces and healthcare diagnostics.',
      appliedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  // Priya Sharma applies to Quantitative Research Intern (FinPulse)
  await prisma.application.create({
    data: {
      studentProfileId: student2.studentProfile!.id,
      internshipId: createdInternships[3].id, // Quant Research
      status: ApplicationStatus.SHORTLISTED,
      coverNote: 'My research at IIT Delhi on transformer models directly maps to financial time-series prediction.',
      appliedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    },
  });

  // Priya Sharma also applies to Frontend Engineering Intern (NexusCloud) - so recruiter has multiple applicants
  await prisma.application.create({
    data: {
      studentProfileId: student2.studentProfile!.id,
      internshipId: createdInternships[0].id, // Frontend Engineering Intern (NexusCloud)
      status: ApplicationStatus.APPLIED,
      coverNote: 'Looking to expand my frontend skills with a world-class team at NexusCloud.',
      appliedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // Jordan Taylor applies to Product Design Intern (DevOrbit)
  await prisma.application.create({
    data: {
      studentProfileId: student3.studentProfile!.id,
      internshipId: createdInternships[8].id, // Product Design (DevOrbit)
      status: ApplicationStatus.SELECTED,
      coverNote: 'Here is a preview of my design systems case study tailored for developer experience tools.',
      appliedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('Database successfully seeded:');
  console.log(`- 1 Recruiter Demo Account: recruiter@demo.com / password123`);
  console.log(`- 1 Student Demo Account: student@demo.com / password123`);
  console.log(`- 6 Verified Tech Companies`);
  console.log(`- ${createdInternships.length} Realistic Internships`);
  console.log(`- Sample applications with APPLIED, SHORTLISTED, INTERVIEW, SELECTED statuses`);
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
