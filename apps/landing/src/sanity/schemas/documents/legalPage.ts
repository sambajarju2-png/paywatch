import { defineType, defineField } from "sanity";

export default defineType({
  name: "legalPage",
  title: "Legal Pages",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "e.g. Privacyverklaring, Algemene Voorwaarden, Data Processing Agreement",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: { list: [{ title: "Dutch", value: "nl" }, { title: "English", value: "en" }] },
      initialValue: "nl",
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "date",
      description: "Date shown at the top of the page",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    }),
  ],
  preview: {
    select: { title: "title", language: "language", date: "lastUpdated" },
    prepare: ({ title, language, date }) => ({
      title,
      subtitle: `${language?.toUpperCase() || "NL"} — Updated: ${date || "Not set"}`,
    }),
  },
});
