import { defineType, defineField } from "sanity";

export default defineType({
  name: "appStrings",
  title: "App Strings",
  type: "document",
  fields: [
    defineField({ name: "key", title: "Key", type: "string", validation: (r) => r.required(), description: "e.g. hero.title, cta.button" }),
    defineField({
      name: "value",
      title: "Value",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "text", rows: 2 },
        { name: "en", title: "English", type: "text", rows: 2 },
      ],
    }),
    defineField({ name: "context", title: "Context / Notes", type: "string", description: "Where this string is used" }),
  ],
  preview: {
    select: { title: "key", subtitle: "value.nl" },
  },
});
