import { renderToString } from "react-dom/server";
import App from "./App";
import { getAllBlogPosts, getBlogPostBySlug } from "./content/blog";
import { getAllDocsPages, getDocsPageBySlug } from "./content/docs";
import {
  BLOG_PATH,
  BLOG_POST_PREFIX,
  DOCS_PAGE_PREFIX,
  DOCS_PATH,
  HOME_PATH,
  PRICING_PATH,
} from "./utils/navigation";

const ORIGIN = "https://sessions.tonbo.io";
const DEFAULT_DESCRIPTION =
  "Persist agent events in remote streams and resume execution for long-running agents.";
const DEFAULT_OG_IMAGE = `${ORIGIN}/og-default.png`;

type HeadData = {
  title: string;
  description: string;
  ogType: "website" | "article";
  ogImage: string;
  canonical: string;
};

function absoluteUrl(path: string) {
  return `${ORIGIN}${path === HOME_PATH ? "/" : path}`;
}

function absoluteImage(path?: string) {
  if (!path) return DEFAULT_OG_IMAGE;
  if (path.startsWith("http")) return path;
  return `${ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

function getHeadForUrl(url: string): HeadData {
  const canonical = absoluteUrl(url);

  if (url === PRICING_PATH) {
    return {
      title: "Pricing | Durable Sessions",
      description:
        "Usage-based pricing for durable agent session storage. No seats, no minimums, first $100 in free credits.",
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      canonical,
    };
  }

  if (url === BLOG_PATH) {
    return {
      title: "Blogs | Durable Sessions",
      description:
        "Engineering notes on durable agent infrastructure — why an agent's session should outlive its harness and sandbox.",
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      canonical,
    };
  }

  if (url.startsWith(BLOG_POST_PREFIX)) {
    const slug = url.slice(BLOG_POST_PREFIX.length);
    const post = getBlogPostBySlug(slug);

    if (post) {
      return {
        title: `${post.title} | Durable Sessions`,
        description: post.subtitle ?? post.summary,
        ogType: "article",
        ogImage: absoluteImage(post.coverImage),
        canonical,
      };
    }
  }

  if (url === DOCS_PATH || url.startsWith(DOCS_PAGE_PREFIX)) {
    const slug = url === DOCS_PATH ? "" : url.slice(DOCS_PAGE_PREFIX.length);
    const page = getDocsPageBySlug(slug);

    if (page) {
      return {
        title: `${page.title} | Durable Sessions`,
        description: page.description ?? DEFAULT_DESCRIPTION,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        canonical,
      };
    }
  }

  return {
    title: "Durable Sessions",
    description: DEFAULT_DESCRIPTION,
    ogType: "website",
    ogImage: DEFAULT_OG_IMAGE,
    canonical,
  };
}

function buildHeadElements(head: HeadData) {
  return new Set([
    { type: "meta", props: { name: "description", content: head.description } },
    { type: "link", props: { rel: "canonical", href: head.canonical } },
    { type: "meta", props: { property: "og:type", content: head.ogType } },
    { type: "meta", props: { property: "og:site_name", content: "Durable Sessions" } },
    { type: "meta", props: { property: "og:title", content: head.title } },
    { type: "meta", props: { property: "og:description", content: head.description } },
    { type: "meta", props: { property: "og:url", content: head.canonical } },
    { type: "meta", props: { property: "og:image", content: head.ogImage } },
    { type: "meta", props: { name: "twitter:card", content: "summary_large_image" } },
    { type: "meta", props: { name: "twitter:title", content: head.title } },
    { type: "meta", props: { name: "twitter:description", content: head.description } },
    { type: "meta", props: { name: "twitter:image", content: head.ogImage } },
  ]);
}

export async function prerender(data: { url: string }) {
  const head = getHeadForUrl(data.url);
  const html = renderToString(<App initialUrl={data.url} />);

  const blogPostLinks = getAllBlogPosts().map((post) => `${BLOG_POST_PREFIX}${post.slug}`);
  const docsPageLinks = getAllDocsPages().map((page) => `${DOCS_PAGE_PREFIX}${page.slug}`);

  return {
    html,
    links: new Set<string>([
      PRICING_PATH,
      BLOG_PATH,
      ...blogPostLinks,
      DOCS_PATH,
      ...docsPageLinks,
    ]),
    head: {
      lang: "en",
      title: head.title,
      elements: buildHeadElements(head),
    },
  };
}
