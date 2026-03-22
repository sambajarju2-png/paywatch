import { defineType, defineField } from "sanity";

export default defineType({
  name: "jobListing",
  title: "Job Listing",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "string", validation: (r) => r.required() },
        { name: "en", title: "English", type: "string", validation: (r) => r.required() },
      ],
    }),
    defineField({
      name: "id",
      title: "ID (used in URL: /jobs/[id])",
      type: "slug",
      options: { source: "title.en" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "string" },
        { name: "en", title: "English", type: "string" },
      ],
    }),
    defineField({
      name: "seniority",
      title: "Seniority",
      type: "string",
      options: { list: ["Junior", "Mid", "Senior"] },
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      options: { list: ["remote", "hybrid", "office"] },
    }),
    defineField({
      name: "salary",
      title: "Salary",
      type: "string",
      description: 'e.g. "€3.500 – €5.000/mo"',
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "text", rows: 3 },
        { name: "en", title: "English", type: "text", rows: 3 },
      ],
    }),
    defineField({
      name: "longDescription",
      title: "Long Description",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "text", rows: 6 },
        { name: "en", title: "English", type: "text", rows: 6 },
      ],
    }),
    defineField({
      name: "requirements",
      title: "Requirements",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "array", of: [{ type: "string" }] },
        { name: "en", title: "English", type: "array", of: [{ type: "string" }] },
      ],
    }),
    defineField({
      name: "niceToHave",
      title: "Nice to Have",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "array", of: [{ type: "string" }] },
        { name: "en", title: "English", type: "array", of: [{ type: "string" }] },
      ],
    }),
    defineField({
      name: "perks",
      title: "Perks",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "array", of: [{ type: "string" }] },
        { name: "en", title: "English", type: "array", of: [{ type: "string" }] },
      ],
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Inactive jobs won't appear on the website",
    }),
  ],
  preview: {
    select: { title: "title.nl", subtitle: "department.nl", active: "active" },
    prepare({ title, subtitle, active }) {
      return {
        title: `${active === false ? "🚫 " : ""}${title || "Untitled"}`,
        subtitle: subtitle || "",
      };
    },
  },
});
