import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { companyProfileSchema } from "@/lib/validations/profile";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "RECRUITER" || !user.company) {
      return NextResponse.json(
        { error: "Company profile not found" },
        { status: 404 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { id: user.company.id },
      include: {
        _count: {
          select: { internships: true },
        },
      },
    });

    return NextResponse.json({ company });
  } catch (error) {
    console.error("Get company error:", error);
    return NextResponse.json(
      { error: "Failed to fetch company profile" },
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

    if (user.role !== "RECRUITER" || !user.company) {
      return NextResponse.json(
        { error: "Company profile not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validated = companyProfileSchema.safeParse(body);

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

    const updated = await prisma.company.update({
      where: { id: user.company.id },
      data: {
        name: data.name,
        logoUrl: data.logoUrl || null,
        website: data.website || null,
        description: data.description || null,
        location: data.location || null,
        industry: data.industry || null,
        size: data.size || null,
      },
    });

    return NextResponse.json({
      message: "Company profile updated successfully",
      company: updated,
    });
  } catch (error) {
    console.error("Update company error:", error);
    return NextResponse.json(
      { error: "Failed to update company profile" },
      { status: 500 }
    );
  }
}
