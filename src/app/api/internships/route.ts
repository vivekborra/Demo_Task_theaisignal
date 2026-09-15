import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  internshipQuerySchema,
  internshipSchema,
} from "@/lib/validations/internship";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Recruiter view: return ALL of the recruiter's own internships (any status)
    const recruiterView = searchParams.get("recruiterView") === "true";
    if (recruiterView) {
      const user = await getCurrentUser();
      if (!user || user.role !== "RECRUITER" || !user.company) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const recruiterInternships = await prisma.internship.findMany({
        where: { companyId: user.company.id },
        orderBy: { createdAt: "desc" },
        include: {
          company: {
            select: { id: true, name: true, logoUrl: true, location: true },
          },
          _count: { select: { applications: true } },
        },
      });

      return NextResponse.json({ internships: recruiterInternships });
    }

    const parsedQuery = internshipQuerySchema.safeParse({
      q: searchParams.get("q") || undefined,
      location: searchParams.get("location") || undefined,
      workMode: searchParams.get("workMode") || undefined,
      minStipend: searchParams.get("minStipend") || undefined,
      skills: searchParams.get("skills") || undefined,
      sort: searchParams.get("sort") || "recent",
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 10,
    });

    if (!parsedQuery.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsedQuery.error.flatten() },
        { status: 400 }
      );
    }

    const { q, location, workMode, minStipend, skills, sort, page, limit } =
      parsedQuery.data;

    const where: Prisma.InternshipWhereInput = {
      status: "PUBLISHED",
    };

    // Keyword search over title, description, company name, or skills
    if (q && q.trim()) {
      const searchTerm = q.trim();
      where.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { company: { name: { contains: searchTerm, mode: "insensitive" } } },
        { skills: { hasSome: [searchTerm] } },
      ];
    }

    // Location filter
    if (location && location.trim()) {
      where.location = { contains: location.trim(), mode: "insensitive" };
    }

    // Work Mode filter
    if (workMode) {
      where.workMode = workMode;
    }

    // Minimum Stipend filter
    if (minStipend !== undefined && minStipend > 0) {
      where.stipend = { gte: minStipend };
    }

    // Skills filter (can be comma-separated or single)
    if (skills && skills.trim()) {
      const skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (skillsArray.length > 0) {
        where.skills = { hasSome: skillsArray };
      }
    }

    // Sorting logic
    let orderBy: Prisma.InternshipOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "deadline") {
      orderBy = { deadline: "asc" };
    } else if (sort === "stipend") {
      orderBy = { stipend: "desc" };
    }

    const skip = (page - 1) * limit;

    const [total, internships] = await Promise.all([
      prisma.internship.count({ where }),
      prisma.internship.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              location: true,
            },
          },
          _count: {
            select: { applications: true },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      internships,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Fetch internships error:", error);
    return NextResponse.json(
      { error: "Failed to fetch internships" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "RECRUITER") {
      return NextResponse.json(
        { error: "Only recruiters can post internships" },
        { status: 403 }
      );
    }

    if (!user.company) {
      return NextResponse.json(
        { error: "Company profile must be created before posting internships" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validated = internshipSchema.safeParse(body);

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

    const internship = await prisma.internship.create({
      data: {
        companyId: user.company.id,
        title: data.title,
        description: data.description,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        skills: data.skills,
        location: data.location,
        workMode: data.workMode,
        stipend: data.stipend,
        durationMonths: data.durationMonths,
        deadline: new Date(data.deadline),
        status: data.status,
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json({ internship }, { status: 201 });
  } catch (error) {
    console.error("Post internship error:", error);
    return NextResponse.json(
      { error: "Failed to create internship posting" },
      { status: 500 }
    );
  }
}
