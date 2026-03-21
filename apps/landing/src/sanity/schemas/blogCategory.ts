import { defineType, defineField } from "sanity";

export default defineType({
  name: "blogCategory",
  title: "Blog Category",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "text", rows: 2 },
        { name: "en", title: "English", type: "text", rows: 2 },
      ],
    }),
  ],
});
