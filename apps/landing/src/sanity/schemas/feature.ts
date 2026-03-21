import { defineType, defineField } from "sanity";

export default defineType({
  name: "feature",
  title: "Feature",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "string", validation: (r) => r.required() },
        { name: "en", title: "English", type: "string", validation: (r) => r.required() },
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "text", rows: 3 },
        { name: "en", title: "English", type: "text", rows: 3 },
      ],
    }),
    defineField({
      name: "icon",
      title: "Icon Name (Lucide)",
      type: "string",
      description: "Lucide icon name, e.g. 'Mail', 'Shield', 'Zap'",
    }),
    defineField({
      name: "screenshot",
      title: "Screenshot",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt Text", type: "string" }],
    }),
    defineField({
      name: "mockupScreen",
      title: "Mockup Screen",
      type: "string",
      description: "Which phone mockup to show: dashboard, payments, stats, cashflow, or leave empty",
      options: {
        list: [
          { title: "None (use icon)", value: "" },
          { title: "Dashboard", value: "dashboard" },
          { title: "Payments", value: "payments" },
          { title: "Statistics", value: "stats" },
          { title: "Cashflow", value: "cashflow" },
        ],
      },
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "title.nl", subtitle: "icon", media: "screenshot" },
  },
  orderings: [
    { title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
});
