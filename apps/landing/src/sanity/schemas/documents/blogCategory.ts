import { defineType, defineField } from "sanity";

export default defineType({
  name: "blogCategory",
  title: "Blog Categories",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
  ],
});
