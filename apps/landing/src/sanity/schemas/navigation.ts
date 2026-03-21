import { defineType, defineField } from "sanity";

export default defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({
      name: "placement",
      title: "Placement",
      type: "string",
      options: { list: ["header", "footer-product", "footer-company", "footer-legal", "footer-support"] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "label", title: "Label", type: "object", fields: [{ name: "nl", type: "string" }, { name: "en", type: "string" }] },
          { name: "href", title: "URL", type: "string", validation: (r) => r.required() },
          { name: "isExternal", title: "External Link?", type: "boolean", initialValue: false },
        ],
        preview: { select: { title: "label.nl", subtitle: "href" } },
      }],
    }),
  ],
  preview: { select: { title: "placement" } },
});
