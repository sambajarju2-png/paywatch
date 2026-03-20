import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "appStrings",
  title: "App Text (Web App)",
  type: "document",
  description: "Editable text strings used in the PayWatch web app (app.paywatch.app)",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: { list: [{ title: "Dutch", value: "nl" }, { title: "English", value: "en" }] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "strings",
      title: "Text Strings",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "key",
              title: "Key",
              type: "string",
              description: "Identifier used in code (e.g. dashboard.title, nav.payments)",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "value",
              title: "Text Value",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "context",
              title: "Context / Where used",
              type: "string",
              description: "e.g. 'Dashboard page heading', 'Bottom nav label'",
            }),
          ],
          preview: {
            select: { title: "key", subtitle: "value" },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { language: "language" },
    prepare: ({ language }) => ({
      title: `App Strings — ${language === "en" ? "English" : "Dutch"}`,
    }),
  },
});
