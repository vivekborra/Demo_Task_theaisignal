"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SearchBar } from "@/components/internships/SearchBar";
import { FilterPanel, FilterState } from "@/components/internships/FilterPanel";
import { InternshipCard, InternshipItem } from "@/components/internships/InternshipCard";
import { Pagination } from "@/components/internships/Pagination";
import { InternshipCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Briefcase, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";

function InternshipsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [internships, setInternships] = useState<InternshipItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract filters from URL search params
  const q = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const workMode = (searchParams.get("workMode") as any) || "";
  const minStipend = searchParams.get("minStipend")
    ? Number(searchParams.get("minStipend"))
    : "";
  const skills = searchParams.get("skills") || "";
  const sort = (searchParams.get("sort") as any) || "recent";
  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  const currentFilters: FilterState = {
    workMode,
    location,
    minStipend,
    skills,
    sort,
  };

  const updateQueryParams = useCallback(
    (newParams: Record<string, string | number | undefined | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, val]) => {
        if (val === undefined || val === null || val === "") {
          params.delete(key);
        } else {
          params.set(key, String(val));
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const fetchInternships = useCallback(async () => {
    setLoading(true);
    try {
      const queryStr = searchParams.toString();
      const res = await fetch(`/api/internships?${queryStr}&limit=9`);
      if (res.ok) {
        const data = await res.json();
        setInternships(data.internships || []);
        setTotalResults(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setInternships([]);
        setTotalResults(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setInternships([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  const handleSearch = (newQ: string) => {
    updateQueryParams({ q: newQ, page: 1 });
  };

  const handleFilterChange = (newFilters: FilterState) => {
    updateQueryParams({
      ...newFilters,
      page: 1,
    });
  };

  const handleResetFilters = () => {
    router.push("/internships");
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Marketplace Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Explore Internships
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Verified high-impact software, data science, AI, and design roles.
              </p>
            </div>

            {/* Mobile Filter Toggle Button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="w-full flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {mobileFilterOpen ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 max-w-3xl">
            <SearchBar initialValue={q} onSearch={handleSearch} />
          </div>
        </div>

        {/* Main Content: Sidebar Filters & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <FilterPanel
              filters={currentFilters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="block lg:hidden mb-6">
              <FilterPanel
                filters={currentFilters}
                onChange={(f) => {
                  handleFilterChange(f);
                  setMobileFilterOpen(false);
                }}
                onReset={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
              />
            </div>
          )}

          {/* Internship Results Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
              <span>
                Showing{" "}
                <span className="font-semibold text-slate-900">
                  {totalResults}
                </span>{" "}
                opportunities
              </span>
              {q && (
                <span>
                  Query: <span className="font-medium text-blue-600">"{q}"</span>
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <InternshipCardSkeleton key={i} />
                ))}
              </div>
            ) : internships.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No internships found"
                description="We couldn't find any opportunities matching your specific filters or search keywords. Try clearing filters or searching for something else."
                actionLabel="Clear All Filters"
                onAction={handleResetFilters}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {internships.map((internship) => (
                  <InternshipCard key={internship.id} internship={internship} />
                ))}
              </div>
            )}

            {!loading && totalPages > 1 && (
              <div className="pt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalResults={totalResults}
                  pageSize={9}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InternshipsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <InternshipCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <InternshipsContent />
    </Suspense>
  );
}
