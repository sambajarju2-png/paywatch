import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "page",
  title: "Pages",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
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
      name: "sections",
      title: "Page Sections",
      description: "Build your page by adding sections below. Drag to reorder.",
      type: "array",
      of: [
        defineArrayMember({ type: "heroSection" }),
        defineArrayMember({ type: "featureGridSection" }),
        defineArrayMember({ type: "statsSection" }),
        defineArrayMember({ type: "ctaSection" }),
        defineArrayMember({ type: "faqSection" }),
        defineArrayMember({ type: "testimonialSection" }),
        defineArrayMember({ type: "richTextSection" }),
        defineArrayMember({ type: "imageTextSection" }),
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
    prepare: ({ title, language }) => ({
      title,
      subtitle: language === "en" ? "English" : "Dutch",
    }),
  },
});
