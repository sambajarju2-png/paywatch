import { defineType, defineField } from "sanity";

export default defineType({
  name: "blogPost",
  title: "Blog Posts",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
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
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short summary shown on the blog listing page",
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "blogCategory" }],
    }),
    defineField({
      name: "author",
      title: "Author Name",
      type: "string",
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
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
  orderings: [
    { title: "Published Date (new)", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", date: "publishedAt", language: "language" },
    prepare: ({ title, date, language }) => ({
      title,
      subtitle: `${language?.toUpperCase() || "NL"} — ${date ? new Date(date).toLocaleDateString("nl-NL") : "Draft"}`,
    }),
  },
});
