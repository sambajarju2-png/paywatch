import { defineType, defineField } from "sanity";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "text", rows: 2 },
        { name: "en", title: "English", type: "text", rows: 2 },
      ],
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        {
          type: "object",
          name: "hero",
          title: "Hero Section",
          fields: [
            { name: "headline", title: "Headline", type: "object", fields: [{ name: "nl", type: "string" }, { name: "en", type: "string" }] },
            { name: "subheadline", title: "Subheadline", type: "object", fields: [{ name: "nl", type: "text", rows: 2 }, { name: "en", type: "text", rows: 2 }] },
            { name: "ctaText", title: "CTA Text", type: "string" },
            { name: "ctaUrl", title: "CTA URL", type: "url" },
            { name: "image", title: "Hero Image", type: "image", options: { hotspot: true } },
          ],
          preview: { select: { title: "headline.nl" }, prepare: ({ title }) => ({ title: `Hero: ${title || "Untitled"}` }) },
        },
        {
          type: "object",
          name: "featureGrid",
          title: "Feature Grid",
          fields: [
            { name: "heading", title: "Heading", type: "object", fields: [{ name: "nl", type: "string" }, { name: "en", type: "string" }] },
          ],
          preview: { prepare: () => ({ title: "Feature Grid" }) },
        },
        {
          type: "object",
          name: "stats",
          title: "Stats Section",
          fields: [
            { name: "heading", title: "Heading", type: "object", fields: [{ name: "nl", type: "string" }, { name: "en", type: "string" }] },
            {
              name: "items",
              title: "Stat Items",
              type: "array",
              of: [{
                type: "object",
                fields: [
                  { name: "value", title: "Value", type: "string" },
                  { name: "label", title: "Label", type: "object", fields: [{ name: "nl", type: "string" }, { name: "en", type: "string" }] },
                ],
              }],
            },
          ],
          preview: { prepare: () => ({ title: "Stats Section" }) },
        },
        {
          type: "object",
          name: "cta",
          title: "CTA Section",
          fields: [
            { name: "heading", title: "Heading", type: "object", fields: [{ name: "nl", type: "string" }, { name: "en", type: "string" }] },
            { name: "subheading", title: "Subheading", type: "object", fields: [{ name: "nl", type: "string" }, { name: "en", type: "string" }] },
            { name: "buttonText", title: "Button Text", type: "string" },
            { name: "buttonUrl", title: "Button URL", type: "url" },
          ],
          preview: { select: { title: "heading.nl" }, prepare: ({ title }) => ({ title: `CTA: ${title || "Untitled"}` }) },
        },
        {
          type: "object",
          name: "richText",
          title: "Rich Text",
          fields: [
            { name: "content", title: "Content", type: "array", of: [{ type: "block" }, { type: "image", options: { hotspot: true } }] },
          ],
          preview: { prepare: () => ({ title: "Rich Text Block" }) },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({ title, subtitle: `/${slug}` }),
  },
});
