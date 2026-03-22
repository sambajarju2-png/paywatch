import { NextRequest, NextResponse } from "next/server";
import { getJobListings, getJobListingById } from "@/lib/sanity-queries";
import { jobListings } from "@/lib/config";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get("id");

  if (jobId) {
    // Single job
    const sanityJob = await getJobListingById(jobId);
    if (sanityJob) return NextResponse.json({ job: sanityJob });
    const hardcodedJob = jobListings.find((j) => j.id === jobId) || null;
    return NextResponse.json({ job: hardcodedJob });
  }

  // All jobs
  const sanityJobs = await getJobListings();
  if (sanityJobs && sanityJobs.length > 0) {
    return NextResponse.json({ jobs: sanityJobs });
  }
  return NextResponse.json({ jobs: jobListings });
}
