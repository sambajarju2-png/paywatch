import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: { list: [{ title: "Dutch", value: "nl" }, { title: "English", value: "en" }] },
      initialValue: "nl",
    }),
    defineField({
      name: "headerLinks",
      title: "Header Navigation Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "href", title: "URL", type: "string" }),
            defineField({ name: "isExternal", title: "Opens in new tab", type: "boolean", initialValue: false }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({
      name: "footerColumns",
      title: "Footer Columns",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Column Title", type: "string" }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "label", title: "Label", type: "string" }),
                    defineField({ name: "href", title: "URL", type: "string" }),
                    defineField({ name: "isExternal", title: "External", type: "boolean", initialValue: false }),
                  ],
                  preview: { select: { title: "label", subtitle: "href" } },
                }),
              ],
            }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
    defineField({
      name: "footerText",
      title: "Footer Copyright Text",
      type: "string",
      description: "e.g. © 2026 PayWatch. Alle rechten voorbehouden.",
    }),
  ],
  preview: {
    select: { language: "language" },
    prepare: ({ language }) => ({ title: `Navigation — ${language === "en" ? "English" : "Dutch"}` }),
  },
});
