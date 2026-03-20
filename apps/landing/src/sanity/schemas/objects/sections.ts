import { defineType, defineField, defineArrayMember } from "sanity";

// Hero section
export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "object",
  fields: [
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "subheadline", title: "Subheadline", type: "text", rows: 2 }),
    defineField({ name: "ctaText", title: "CTA Button Text", type: "string" }),
    defineField({ name: "ctaUrl", title: "CTA Button URL", type: "url" }),
    defineField({ name: "secondaryCtaText", title: "Secondary CTA Text", type: "string" }),
    defineField({ name: "secondaryCtaUrl", title: "Secondary CTA URL", type: "url" }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "showMockup", title: "Show iPhone Mockup", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { title: "headline" },
    prepare: ({ title }) => ({ title: title || "Hero Section", subtitle: "Hero" }),
  },
});

// Feature grid section
export const featureGridSection = defineType({
  name: "featureGridSection",
  title: "Feature Grid",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow Text", type: "string", description: "Small text above the title (e.g. 'Features')" }),
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({ name: "subtitle", title: "Section Subtitle", type: "text", rows: 2 }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Lucide Icon Name", type: "string", description: "e.g. Shield, Bell, TrendingUp" }),
            defineField({ name: "title", title: "Feature Title", type: "string" }),
            defineField({ name: "description", title: "Feature Description", type: "text", rows: 2 }),
            defineField({ name: "screenshot", title: "Screenshot", type: "image", options: { hotspot: true } }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: title || "Feature Grid", subtitle: "Features" }),
  },
});

// Stats / numbers section
export const statsSection = defineType({
  name: "statsSection",
  title: "Statistics Section",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({ name: "subtitle", title: "Subtitle", type: "text", rows: 2 }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", description: "e.g. 1.4M, 87%, €2.3B" }),
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "description", title: "Description", type: "string" }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: title || "Stats Section", subtitle: "Statistics" }),
  },
});

// CTA section
export const ctaSection = defineType({
  name: "ctaSection",
  title: "Call to Action",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "ctaText", title: "Button Text", type: "string" }),
    defineField({ name: "ctaUrl", title: "Button URL", type: "url" }),
    defineField({ name: "variant", title: "Style", type: "string", options: { list: ["default", "blue", "navy", "gradient"] }, initialValue: "default" }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: title || "CTA Section", subtitle: "Call to Action" }),
  },
});

// FAQ section
export const faqSection = defineType({
  name: "faqSection",
  title: "FAQ Section",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({
      name: "items",
      title: "FAQ Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "question", title: "Question", type: "string" }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 4 }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: title || "FAQ Section", subtitle: "FAQ" }),
  },
});

// Testimonial section
export const testimonialSection = defineType({
  name: "testimonialSection",
  title: "Testimonials",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section Title", type: "string" }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "quote", title: "Quote", type: "text", rows: 3 }),
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "role", title: "Role / Location", type: "string" }),
            defineField({ name: "avatar", title: "Avatar", type: "image" }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: title || "Testimonials", subtitle: "Testimonials" }),
  },
});

// Rich text block
export const richTextSection = defineType({
  name: "richTextSection",
  title: "Rich Text Block",
  type: "object",
  fields: [
    defineField({ name: "content", title: "Content", type: "blockContent" }),
  ],
  preview: {
    prepare: () => ({ title: "Rich Text Block", subtitle: "Text" }),
  },
});

// Image + Text split
export const imageTextSection = defineType({
  name: "imageTextSection",
  title: "Image + Text Split",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imagePosition", title: "Image Position", type: "string", options: { list: ["left", "right"] }, initialValue: "right" }),
    defineField({ name: "ctaText", title: "CTA Text", type: "string" }),
    defineField({ name: "ctaUrl", title: "CTA URL", type: "url" }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: title || "Image + Text", subtitle: "Split Section" }),
  },
});
