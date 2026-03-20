import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "pricing",
  title: "Pricing",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Page Title", type: "string", initialValue: "Pricing" }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: { list: [{ title: "Dutch", value: "nl" }, { title: "English", value: "en" }] },
      initialValue: "nl",
    }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "subtitle", title: "Subtitle", type: "text", rows: 2 }),
    defineField({
      name: "tiers",
      title: "Pricing Tiers",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Tier Name", type: "string", description: "e.g. Free, Pro, Business" }),
            defineField({ name: "price", title: "Price", type: "string", description: "e.g. €0, €4,99/mo, Custom" }),
            defineField({ name: "priceNote", title: "Price Note", type: "string", description: "e.g. per maand, voor altijd gratis" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
            defineField({ name: "highlighted", title: "Highlighted (recommended)", type: "boolean", initialValue: false }),
            defineField({ name: "ctaText", title: "CTA Button Text", type: "string" }),
            defineField({ name: "ctaUrl", title: "CTA Button URL", type: "url" }),
            defineField({
              name: "features",
              title: "Features",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "text", title: "Feature Text", type: "string" }),
                    defineField({ name: "included", title: "Included", type: "boolean", initialValue: true }),
                  ],
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "price" },
          },
        }),
      ],
    }),
    defineField({
      name: "faq",
      title: "Pricing FAQ",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "question", title: "Question", type: "string" }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 3 }),
          ],
        }),
      ],
    }),
    defineField({ name: "seo", title: "SEO Settings", type: "seo" }),
  ],
});
