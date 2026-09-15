import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { internshipSchema } from "@/lib/validations/internship";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const internship = await prisma.internship.findUnique({
      where: { id: params.id },
      include: {
        company: true,
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!internship) {
      return NextResponse.json(
        { error: "Internship not found" },
        { status: 404 }
      );
    }

    // Check if the currently authenticated student has already applied
    const currentUser = await getCurrentUser();
    let hasApplied = false;
    let userApplication = null;

    if (currentUser?.role === "STUDENT" && currentUser.studentProfile) {
      userApplication = await prisma.application.findUnique({
        where: {
          studentProfileId_internshipId: {
            studentProfileId: currentUser.studentProfile.id,
            internshipId: internship.id,
          },
        },
      });
      hasApplied = !!userApplication;
    }

    return NextResponse.json({
      internship,
      hasApplied,
      userApplication,
    });
  } catch (error) {
    console.error("Get internship error:", error);
    return NextResponse.json(
      { error: "Failed to fetch internship" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "RECRUITER" || !user.company) {
      return NextResponse.json(
        { error: "Only authorized recruiters can update postings" },
        { status: 403 }
      );
    }

    // Verify ownership
    const existing = await prisma.internship.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Internship not found" },
        { status: 404 }
      );
    }

    if (existing.companyId !== user.company.id) {
      return NextResponse.json(
        { error: "Forbidden: You cannot modify an internship from another company" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = internshipSchema.partial().safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validated.data;

    const updated = await prisma.internship.update({
      where: { id: params.id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.responsibilities && { responsibilities: data.responsibilities }),
        ...(data.requirements && { requirements: data.requirements }),
        ...(data.skills && { skills: data.skills }),
        ...(data.location && { location: data.location }),
        ...(data.workMode && { workMode: data.workMode }),
        ...(data.stipend !== undefined && { stipend: data.stipend }),
        ...(data.durationMonths && { durationMonths: data.durationMonths }),
        ...(data.deadline && { deadline: new Date(data.deadline) }),
        ...(data.status && { status: data.status }),
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json({ internship: updated });
  } catch (error) {
    console.error("Update internship error:", error);
    return NextResponse.json(
      { error: "Failed to update internship" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "RECRUITER" || !user.company) {
      return NextResponse.json(
        { error: "Only authorized recruiters can delete postings" },
        { status: 403 }
      );
    }

    const existing = await prisma.internship.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Internship not found" },
        { status: 404 }
      );
    }

    if (existing.companyId !== user.company.id) {
      return NextResponse.json(
        { error: "Forbidden: You cannot delete an internship from another company" },
        { status: 403 }
      );
    }

    await prisma.internship.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Internship deleted successfully" });
  } catch (error) {
    console.error("Delete internship error:", error);
    return NextResponse.json(
      { error: "Failed to delete internship" },
      { status: 500 }
    );
  }
}
