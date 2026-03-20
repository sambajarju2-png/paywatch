import { defineType, defineField } from "sanity";

export default defineType({
  name: "seo",
  title: "SEO Settings",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Page title for search engines (50-60 characters ideal)",
      validation: (Rule) => Rule.max(70).warning("Keep under 60 characters for best results"),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "Description shown in search results (150-160 characters ideal)",
      validation: (Rule) => Rule.max(170).warning("Keep under 160 characters"),
    }),
    defineField({
      name: "keywords",
      title: "Focus Keywords",
      type: "array",
      of: [{ type: "string" }],
      description: "Target keywords for this page",
      options: { layout: "tags" },
    }),
    defineField({
      name: "ogImage",
      title: "Social Share Image (og:image)",
      type: "image",
      description: "Image shown when shared on social media (1200×630px recommended)",
      options: { hotspot: true },
    }),
    defineField({
      name: "ogTitle",
      title: "Social Title (og:title)",
      type: "string",
      description: "Override title for social media shares. Falls back to Meta Title if empty.",
    }),
    defineField({
      name: "ogDescription",
      title: "Social Description (og:description)",
      type: "text",
      rows: 2,
      description: "Override description for social media. Falls back to Meta Description.",
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
      description: "Set if this page has a canonical version elsewhere",
    }),
    defineField({
      name: "noIndex",
      title: "No Index",
      type: "boolean",
      description: "Hide this page from search engines",
      initialValue: false,
    }),
    defineField({
      name: "noFollow",
      title: "No Follow",
      type: "boolean",
      description: "Tell search engines not to follow links on this page",
      initialValue: false,
    }),
    defineField({
      name: "structuredData",
      title: "JSON-LD Structured Data",
      type: "text",
      rows: 6,
      description: "Custom JSON-LD schema.org data (advanced). Leave empty for auto-generated.",
    }),
  ],
});
