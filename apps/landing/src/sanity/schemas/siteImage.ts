import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteImage",
  title: "Site Image",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Key",
      type: "string",
      validation: (r) => r.required(),
      description: "Where this image is used. Examples: step-1, step-2, step-3, feature-gmail, feature-escalation, about-samba, about-mariama",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      description: "Description for accessibility",
    }),
    defineField({
      name: "page",
      title: "Page",
      type: "string",
      description: "Which page this image belongs to",
      options: {
        list: [
          { title: "Homepage", value: "home" },
          { title: "Features", value: "features" },
          { title: "About", value: "about" },
          { title: "Pricing", value: "pricing" },
          { title: "Blog", value: "blog" },
          { title: "Other", value: "other" },
        ],
      },
    }),
  ],
  preview: {
    select: { title: "key", subtitle: "page", media: "image" },
  },
});
