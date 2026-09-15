import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const internshipId = searchParams.get("internshipId");

    if (user.role === "STUDENT") {
      if (!user.studentProfile) {
        return NextResponse.json({ applications: [] });
      }

      const applications = await prisma.application.findMany({
        where: { studentProfileId: user.studentProfile.id },
        orderBy: { appliedAt: "desc" },
        include: {
          internship: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  logoUrl: true,
                  location: true,
                },
              },
            },
          },
        },
      });

      return NextResponse.json({ applications });
    }

    if (user.role === "RECRUITER") {
      if (!user.company) {
        return NextResponse.json({ applications: [] });
      }

      // If recruiter specified a particular internship
      const whereClause = {
        internship: {
          companyId: user.company.id,
          ...(internshipId ? { id: internshipId } : {}),
        },
      };

      const applications = await prisma.application.findMany({
        where: whereClause,
        orderBy: { appliedAt: "desc" },
        include: {
          internship: {
            select: {
              id: true,
              title: true,
              status: true,
              location: true,
              workMode: true,
            },
          },
          studentProfile: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
              education: {
                orderBy: { startYear: "desc" },
              },
            },
          },
        },
      });

      return NextResponse.json({ applications });
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  } catch (error) {
    console.error("Fetch applications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
