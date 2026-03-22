import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

// SanityImageSource works with both @sanity/image-url v1 and v2
type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0];

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pwf6qbjc",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-15",
  useCdn: process.env.NODE_ENV === "production",
};

/* Public client — for client-side/CDN queries */
export const sanityClient = createClient(sanityConfig);

/* Server client — uses token for authenticated fetches (published + draft) */
export const serverSanityClient = createClient({
  ...sanityConfig,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/* Image URL builder */
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/* Preview client (alias for backward compat) */
export const previewClient = serverSanityClient;

/* Helper: get client based on preview mode */
export function getClient(preview = false) {
  return preview ? serverSanityClient : sanityClient;
}
