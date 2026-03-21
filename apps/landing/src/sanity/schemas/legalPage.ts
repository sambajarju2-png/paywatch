import { defineType, defineField } from "sanity";

export default defineType({
  name: "legalPage",
  title: "Legal Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "object", fields: [{ name: "nl", type: "string" }, { name: "en", type: "string" }] }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title.nl" }, validation: (r) => r.required() }),
    defineField({ name: "lastUpdated", title: "Last Updated", type: "date" }),
    defineField({
      name: "body",
      title: "Body",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "array", of: [{ type: "block" }] },
        { name: "en", title: "English", type: "array", of: [{ type: "block" }] },
      ],
    }),
  ],
  preview: { select: { title: "title.nl" } },
});
