// Object types
import seo from "./objects/seo";
import blockContent from "./objects/blockContent";
import {
  heroSection,
  featureGridSection,
  statsSection,
  ctaSection,
  faqSection,
  testimonialSection,
  richTextSection,
  imageTextSection,
} from "./objects/sections";

// Document types
import page from "./documents/page";
import blogPost from "./documents/blogPost";
import blogCategory from "./documents/blogCategory";
import legalPage from "./documents/legalPage";
import subprocessors from "./documents/subprocessors";
import pricing from "./documents/pricing";
import appStrings from "./documents/appStrings";
import navigation from "./documents/navigation";

export const schemaTypes = [
  // Objects (must be registered before documents that use them)
  seo,
  blockContent,
  heroSection,
  featureGridSection,
  statsSection,
  ctaSection,
  faqSection,
  testimonialSection,
  richTextSection,
  imageTextSection,
  // Documents
  page,
  blogPost,
  blogCategory,
  legalPage,
  subprocessors,
  pricing,
  appStrings,
  navigation,
];
