import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { vitePrerenderPlugin } from "vite-prerender-plugin";

export default defineConfig({
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: "frontmatter" }],
          remarkGfm,
        ],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeShiki,
            {
              theme: "gruvbox-dark-hard",
              defaultLanguage: "text",
            },
          ],
        ],
        mdExtensions: [],
        mdxExtensions: [".mdx"],
      }),
    },
    react({ include: /\.(jsx|tsx|mdx)$/ }),
    vitePrerenderPlugin({
      renderTarget: "#root",
      prerenderScript: "/src/prerender.tsx",
    }),
  ],
});
