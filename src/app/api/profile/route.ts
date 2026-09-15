import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { studentProfileSchema } from "@/lib/validations/profile";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "STUDENT" || !user.studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { id: user.studentProfile.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        education: {
          orderBy: { startYear: "desc" },
        },
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "STUDENT" || !user.studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validated = studentProfileSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      name,
      headline,
      bio,
      skills,
      resumeUrl,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      education,
    } = validated.data;

    // Update user name and profile in a transaction
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update User name
      await tx.user.update({
        where: { id: user.id },
        data: { name },
      });

      // 2. Update StudentProfile
      const updatedProfile = await tx.studentProfile.update({
        where: { id: user.studentProfile!.id },
        data: {
          headline: headline || null,
          bio: bio || null,
          skills: skills || [],
          resumeUrl: resumeUrl || null,
          linkedinUrl: linkedinUrl || null,
          githubUrl: githubUrl || null,
          portfolioUrl: portfolioUrl || null,
        },
      });

      // 3. Update Education if provided
      if (education) {
        // Delete existing education records and recreate
        await tx.education.deleteMany({
          where: { studentProfileId: updatedProfile.id },
        });

        if (education.length > 0) {
          await tx.education.createMany({
            data: education.map((edu) => ({
              studentProfileId: updatedProfile.id,
              degree: edu.degree,
              institution: edu.institution,
              fieldOfStudy: edu.fieldOfStudy,
              startYear: edu.startYear,
              endYear: edu.endYear || null,
            })),
          });
        }
      }

      return tx.studentProfile.findUnique({
        where: { id: updatedProfile.id },
        include: {
          user: { select: { id: true, name: true, email: true } },
          education: { orderBy: { startYear: "desc" } },
        },
      });
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: updated,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
