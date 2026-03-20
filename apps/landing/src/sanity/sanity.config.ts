import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "paywatch",
  title: "PayWatch CMS",
  projectId: "pwf6qbjc",
  dataset: "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Pages")
              .child(S.documentTypeList("page").title("Pages")),
            S.divider(),
            S.listItem()
              .title("Blog")
              .child(
                S.list()
                  .title("Blog")
                  .items([
                    S.listItem().title("Posts").child(S.documentTypeList("blogPost").title("Blog Posts")),
                    S.listItem().title("Categories").child(S.documentTypeList("blogCategory").title("Categories")),
                  ])
              ),
            S.divider(),
            S.listItem()
              .title("Legal")
              .child(S.documentTypeList("legalPage").title("Legal Pages")),
            S.listItem()
              .title("Subprocessors")
              .child(S.documentTypeList("subprocessors").title("Subprocessors")),
            S.listItem()
              .title("Pricing")
              .child(S.documentTypeList("pricing").title("Pricing")),
            S.divider(),
            S.listItem()
              .title("Navigation")
              .child(S.documentTypeList("navigation").title("Navigation")),
            S.listItem()
              .title("App Text Strings")
              .child(S.documentTypeList("appStrings").title("App Strings")),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
