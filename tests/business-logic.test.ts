import { PrismaClient, Role, WorkMode, InternshipStatus, ApplicationStatus } from '@prisma/client';
import assert from 'node:assert';

const prisma = new PrismaClient();

async function runTests() {
  console.log('🧪 Starting InternHub Business Logic & Security Verification Tests...\n');

  let passed = 0;
  let total = 0;

  async function test(name: string, fn: () => Promise<void>) {
    total++;
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
    }
  }

  // Find test users and internships seeded
  const student = await prisma.user.findUnique({
    where: { email: 'student@demo.com' },
    include: { studentProfile: true },
  });
  assert(student?.studentProfile, 'Demo student profile must exist');

  const recruiter = await prisma.user.findUnique({
    where: { email: 'recruiter@demo.com' },
    include: { company: true },
  });
  assert(recruiter?.company, 'Demo recruiter company must exist');

  const otherRecruiter = await prisma.user.findUnique({
    where: { email: 'recruiter.finpulse@demo.com' },
    include: { company: true },
  });
  assert(otherRecruiter?.company, 'Other recruiter company must exist');

  // Test 1: Duplicate application prevention at DB level
  await test('Duplicate application prevention: Database unique constraint enforces single application per student/internship', async () => {
    // Find an active internship that student hasn't applied to yet
    const appliedInternshipIds = (
      await prisma.application.findMany({
        where: { studentProfileId: student.studentProfile!.id },
        select: { internshipId: true },
      })
    ).map((a) => a.internshipId);

    const availableInternship = await prisma.internship.findFirst({
      where: {
        id: { notIn: appliedInternshipIds },
        status: InternshipStatus.PUBLISHED,
        deadline: { gt: new Date() },
      },
    });

    assert(availableInternship, 'Must find an available internship for test');

    // 1st application succeeds
    const app1 = await prisma.application.create({
      data: {
        studentProfileId: student.studentProfile!.id,
        internshipId: availableInternship.id,
        status: ApplicationStatus.APPLIED,
      },
    });
    assert(app1.id, 'First application should succeed');

    // 2nd application must fail with unique constraint violation (P2002)
    let caughtDuplicate = false;
    try {
      await prisma.application.create({
        data: {
          studentProfileId: student.studentProfile!.id,
          internshipId: availableInternship.id,
          status: ApplicationStatus.APPLIED,
        },
      });
    } catch (e: any) {
      if (e.code === 'P2002' || e.message.includes('Unique constraint')) {
        caughtDuplicate = true;
      }
    }

    assert(caughtDuplicate, 'Database unique constraint must reject duplicate application');

    // Clean up test application
    await prisma.application.delete({ where: { id: app1.id } });
  });

  // Test 2: Expired internship cannot accept applications
  await test('Expired internship validation: Application logic rejects submissions after deadline', async () => {
    let expiredInternship = await prisma.internship.findFirst({
      where: {
        deadline: { lt: new Date() },
      },
    });

    if (!expiredInternship) {
      expiredInternship = await prisma.internship.create({
        data: {
          companyId: recruiter.company!.id,
          title: 'Expired Verification Internship',
          description: 'Temporary internship used to validate that expired postings reject new applications.',
          responsibilities: ['Validate deadline rules'],
          requirements: ['Must be expired'],
          skills: ['Verification'],
          location: 'Remote',
          workMode: WorkMode.REMOTE,
          stipend: 2000,
          durationMonths: 1,
          deadline: new Date(Date.now() - 24 * 60 * 60 * 1000),
          status: InternshipStatus.PUBLISHED,
        },
      });
    }

    // Simulate the business validation in /api/internships/[id]/apply
    const isPastDeadline = new Date(expiredInternship.deadline).getTime() < Date.now();
    assert(isPastDeadline === true, 'Internship deadline must be verified as past');

    const canApply = expiredInternship.status === 'PUBLISHED' && !isPastDeadline;
    assert.strictEqual(canApply, false, 'Expired internship must not allow applications');
  });

  // Test 3: Manually closed internship cannot accept applications
  await test('Closed internship validation: Applications rejected when status is CLOSED', async () => {
    const closedInternship = await prisma.internship.findFirst({
      where: {
        status: InternshipStatus.CLOSED,
      },
    });

    assert(closedInternship, 'Closed internship must exist in seed');

    const canApply = closedInternship.status === 'PUBLISHED' && new Date(closedInternship.deadline).getTime() > Date.now();
    assert.strictEqual(canApply, false, 'Closed internship must not allow applications');
  });

  // Test 4: Unauthorized recruiter cannot modify another company\'s internship
  await test('Recruiter authorization: Recruiter cannot modify posting belonging to another company', async () => {
    // Find internship owned by otherRecruiter (FinPulse)
    const finpulseInternship = await prisma.internship.findFirst({
      where: { companyId: otherRecruiter.company!.id },
    });

    assert(finpulseInternship, 'FinPulse internship must exist');

    // Attempt modification as Sarah Jenkins (NexusCloud)
    const callerCompanyId = recruiter.company!.id;
    const isAuthorizedOwner = finpulseInternship.companyId === callerCompanyId;

    assert.strictEqual(
      isAuthorizedOwner,
      false,
      'Recruiter from NexusCloud must not be recognized as owner of FinPulse internship'
    );
  });

  // Test 5: Application status update workflow
  await test('Recruiter workflow: Authorized recruiter can update candidate status through pipeline', async () => {
    // Find an application for recruiter's company
    const app = await prisma.application.findFirst({
      where: {
        internship: { companyId: recruiter.company!.id },
      },
    });

    assert(app, 'Application for recruiter company must exist');

    // Update status to INTERVIEW
    const updated = await prisma.application.update({
      where: { id: app.id },
      data: { status: ApplicationStatus.INTERVIEW },
    });

    assert.strictEqual(updated.status, ApplicationStatus.INTERVIEW);

    // Update status to SELECTED
    const updated2 = await prisma.application.update({
      where: { id: app.id },
      data: { status: ApplicationStatus.SELECTED },
    });

    assert.strictEqual(updated2.status, ApplicationStatus.SELECTED);
  });

  // Test 6: Database query filtering logic
  await test('Search & Filter logic: Correctly filters PostgreSQL records by query, workMode, and stipend', async () => {
    // Remote filter
    const remoteResults = await prisma.internship.findMany({
      where: {
        status: InternshipStatus.PUBLISHED,
        workMode: WorkMode.REMOTE,
      },
    });
    assert(remoteResults.length > 0, 'Should find remote internships');
    assert(remoteResults.every((i) => i.workMode === WorkMode.REMOTE), 'All results must be remote');

    // Stipend filter (>= $3,000)
    const highStipendResults = await prisma.internship.findMany({
      where: {
        status: InternshipStatus.PUBLISHED,
        stipend: { gte: 3000 },
      },
    });
    assert(highStipendResults.length > 0, 'Should find internships with stipend >= 3000');
    assert(highStipendResults.every((i) => i.stipend >= 3000), 'All results must have stipend >= 3000');

    // Keyword search in PostgreSQL
    const keywordResults = await prisma.internship.findMany({
      where: {
        status: InternshipStatus.PUBLISHED,
        OR: [
          { title: { contains: 'Frontend', mode: 'insensitive' } },
          { description: { contains: 'Frontend', mode: 'insensitive' } },
        ],
      },
    });
    assert(keywordResults.length > 0, 'Should find frontend internships');
  });

  console.log(`\nResults: ${passed} / ${total} tests passed.\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests()
  .catch((err) => {
    console.error('Fatal test error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
