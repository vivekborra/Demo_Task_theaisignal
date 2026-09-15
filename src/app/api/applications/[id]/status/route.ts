import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { updateApplicationStatusSchema } from "@/lib/validations/application";

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
        { error: "Only authorized recruiters can update applicant status" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = updateApplicationStatusSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: "Invalid application status",
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Verify ownership: application -> internship -> companyId must equal user.company.id
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        internship: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.internship.companyId !== user.company.id) {
      return NextResponse.json(
        {
          error:
            "Forbidden: You cannot modify an applicant for an internship posted by another company",
        },
        { status: 403 }
      );
    }

    const updated = await prisma.application.update({
      where: { id: params.id },
      data: {
        status: validated.data.status,
      },
      include: {
        internship: true,
        studentProfile: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    return NextResponse.json({
      message: `Status updated to ${validated.data.status}`,
      application: updated,
    });
  } catch (error) {
    console.error("Update application status error:", error);
    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 }
    );
  }
}
