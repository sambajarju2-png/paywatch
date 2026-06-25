import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { jobListings } from "@/lib/config";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pwf6qbjc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-15",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const ALL_JOBS_QUERY = `*[_type == "jobListing" && active == true] | order(_createdAt desc) {
  "id": id.current,
  title,
  department,
  seniority,
  location,
  salary,
  description,
  longDescription,
  requirements,
  niceToHave,
  perks,
  active
}`;

const SINGLE_JOB_QUERY = `*[_type == "jobListing" && id.current == $jobId && active == true][0] {
  "id": id.current,
  title,
  department,
  seniority,
  location,
  salary,
  description,
  longDescription,
  requirements,
  niceToHave,
  perks,
  active
}`;

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get("id");

  try {
    if (jobId) {
      const job = await client.fetch(SINGLE_JOB_QUERY, { jobId });
      return NextResponse.json({ job: job || jobListings.find((j) => j.id === jobId) || null });
    }

    const jobs = await client.fetch(ALL_JOBS_QUERY);
    return NextResponse.json({ jobs: jobs && jobs.length > 0 ? jobs : jobListings });
  } catch (e) {
    console.error("[Sanity] Job listings API error:", e);
    if (jobId) {
      return NextResponse.json({ job: jobListings.find((j) => j.id === jobId) || null });
    }
    return NextResponse.json({ jobs: jobListings });
  }
}
