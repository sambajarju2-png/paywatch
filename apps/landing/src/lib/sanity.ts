import { createClient } from "next-sanity";

export const sanityClient = createClient({
  projectId: "pwf6qbjc",
  dataset: "production",
  apiVersion: "2024-03-15",
  useCdn: true,
});
