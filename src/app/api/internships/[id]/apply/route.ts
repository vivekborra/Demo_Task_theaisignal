import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { applySchema } from "@/lib/validations/application";
import { Prisma } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in as a student to apply." },
        { status: 401 }
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Only students can submit internship applications." },
        { status: 403 }
      );
    }

    if (!user.studentProfile) {
      return NextResponse.json(
        { error: "Please complete your student profile before applying." },
        { status: 400 }
      );
    }

    const internship = await prisma.internship.findUnique({
      where: { id: params.id },
      include: { company: true },
    });

    if (!internship) {
      return NextResponse.json(
        { error: "Internship not found." },
        { status: 404 }
      );
    }

    // Edge case 1: Check status
    if (internship.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "This internship is closed and no longer accepting applications." },
        { status: 400 }
      );
    }

    // Edge case 2: Check deadline
    const now = new Date();
    if (new Date(internship.deadline).getTime() < now.getTime()) {
      return NextResponse.json(
        { error: "The application deadline for this internship has passed." },
        { status: 400 }
      );
    }

    // Edge case 3: Check duplicate application in DB
    const existingApplication = await prisma.application.findUnique({
      where: {
        studentProfileId_internshipId: {
          studentProfileId: user.studentProfile.id,
          internshipId: internship.id,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        {
          error: "You have already applied to this internship.",
          currentStatus: existingApplication.status,
          appliedAt: existingApplication.appliedAt,
        },
        { status: 409 }
      );
    }

    let coverNote: string | null = null;
    try {
      const body = await request.json();
      const validated = applySchema.safeParse(body);
      if (validated.success && validated.data.coverNote) {
        coverNote = validated.data.coverNote;
      }
    } catch {
      // coverNote is optional
    }

    // Create the application (with database-level unique constraint guard)
    const application = await prisma.application.create({
      data: {
        studentProfileId: user.studentProfile.id,
        internshipId: internship.id,
        status: "APPLIED",
        coverNote,
      },
      include: {
        internship: {
          include: {
            company: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully!",
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "You have already submitted an application for this role." },
        { status: 409 }
      );
    }

    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again later." },
      { status: 500 }
    );
  }
}
