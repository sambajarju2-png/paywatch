import { defineType, defineField } from "sanity";

export default defineType({
  name: "roadmapItem",
  title: "Roadmap Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "string" },
        { name: "en", title: "English", type: "string" },
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "text", rows: 2 },
        { name: "en", title: "English", type: "text", rows: 2 },
      ],
    }),
    defineField({
      name: "quarter",
      title: "Quarter (e.g. Q3 2025)",
      type: "string",
    }),
    defineField({
      name: "launchDate",
      title: "Launch Date",
      type: "date",
      description: "Used to sort items and determine if past/future",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Voltooid (Done)", value: "done" },
          { title: "Nu bezig (Current)", value: "current" },
          { title: "Binnenkort (Upcoming)", value: "upcoming" },
          { title: "Gepland (Planned)", value: "planned" },
        ],
      },
      initialValue: "planned",
    }),
    defineField({
      name: "url",
      title: "Link URL (optional)",
      type: "string",
      description: "Link to blog post, feature page, etc. Leave empty for no link.",
    }),
    defineField({
      name: "features",
      title: "Feature list (optional bullet points)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      description: "Lower number = shown first. Use 10, 20, 30 etc.",
    }),
  ],
  orderings: [
    { title: "By Date", name: "dateAsc", by: [{ field: "launchDate", direction: "asc" }] },
    { title: "By Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title.nl", subtitle: "quarter", status: "status" },
    prepare({ title, subtitle, status }) {
      const icons: Record<string, string> = { done: "✅", current: "🔵", upcoming: "🟡", planned: "⚪" };
      return { title: `${icons[status] || "⚪"} ${title || "Untitled"}`, subtitle };
    },
  },
});
