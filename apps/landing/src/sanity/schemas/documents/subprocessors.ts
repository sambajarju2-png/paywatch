import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "subprocessors",
  title: "Subprocessors",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      initialValue: "Subprocessors",
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: { list: [{ title: "Dutch", value: "nl" }, { title: "English", value: "en" }] },
      initialValue: "nl",
    }),
    defineField({
      name: "introduction",
      title: "Introduction Text",
      type: "text",
      rows: 4,
      description: "Explanatory text at the top of the page about why you use these services",
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "date",
    }),
    defineField({
      name: "processors",
      title: "Subprocessors",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Service Name", type: "string", description: "e.g. Supabase, Anthropic, Google Cloud" }),
            defineField({ name: "purpose", title: "Purpose", type: "string", description: "e.g. Database & Authentication" }),
            defineField({ name: "dataProcessed", title: "Data Processed", type: "string", description: "e.g. User accounts, encrypted OAuth tokens" }),
            defineField({ name: "location", title: "Data Location", type: "string", description: "e.g. EU (eu-west-1), US" }),
            defineField({ name: "website", title: "Website URL", type: "url" }),
            defineField({ name: "privacyPolicyUrl", title: "Privacy Policy URL", type: "url" }),
            defineField({
              name: "category",
              title: "Category",
              type: "string",
              options: {
                list: [
                  { title: "Infrastructure", value: "infrastructure" },
                  { title: "AI / Machine Learning", value: "ai" },
                  { title: "Email", value: "email" },
                  { title: "Analytics", value: "analytics" },
                  { title: "Error Tracking", value: "errors" },
                  { title: "Hosting", value: "hosting" },
                  { title: "CMS", value: "cms" },
                  { title: "Other", value: "other" },
                ],
              },
            }),
            defineField({ name: "gdprCompliant", title: "GDPR Compliant", type: "boolean", initialValue: true }),
            defineField({ name: "notes", title: "Notes", type: "text", rows: 2, description: "Why we chose this service, what data flows through it" }),
          ],
          preview: {
            select: { title: "name", subtitle: "purpose" },
          },
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    }),
  ],
  preview: {
    select: { title: "title", language: "language" },
    prepare: ({ title, language }) => ({ title, subtitle: language?.toUpperCase() || "NL" }),
  },
});
