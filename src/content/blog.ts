type BlogFrontmatter = {
  title: string;
  slug: string;
  date: string;
  category: string;
  summary: string;
  subtitle?: string;
  coverImage?: string;
  coverAlt?: string;
  featured?: boolean;
};

export type BlogPost = BlogFrontmatter & {
  body: string;
  publishedAt: string;
};

const markdownModules = import.meta.glob("./posts/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

function formatBlogDate(date: string) {
  const normalizedDate = new Date(`${date}T00:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(normalizedDate);
}

function parseFrontmatterValue(value: string) {
  const trimmedValue = value.trim();

  if (trimmedValue === "true") {
    return true;
  }

  if (trimmedValue === "false") {
    return false;
  }

  return trimmedValue.replace(/^["']|["']$/g, "");
}

function parseMarkdownModule(rawMarkdown: string, path: string): BlogPost {
  const match = rawMarkdown.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`Missing frontmatter in blog markdown file: ${path}`);
  }

  const [, frontmatterBlock, body] = match;
  const frontmatter = frontmatterBlock.split("\n").reduce<Record<string, string | boolean>>((acc, line) => {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      return acc;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1);
    acc[key] = parseFrontmatterValue(value);
    return acc;
  }, {});

  const filename = path.split("/").pop()?.replace(/\.md$/, "");

  if (
    typeof frontmatter.title !== "string" ||
    typeof frontmatter.date !== "string" ||
    typeof frontmatter.category !== "string" ||
    typeof frontmatter.summary !== "string"
  ) {
    throw new Error(`Missing required blog frontmatter fields in: ${path}`);
  }

  const slug = typeof frontmatter.slug === "string" ? frontmatter.slug : filename;

  if (!slug) {
    throw new Error(`Unable to derive blog slug from: ${path}`);
  }

  return {
    title: frontmatter.title,
    slug,
    date: frontmatter.date,
    category: frontmatter.category,
    summary: frontmatter.summary,
    subtitle: typeof frontmatter.subtitle === "string" ? frontmatter.subtitle : undefined,
    coverImage: typeof frontmatter.coverImage === "string" ? frontmatter.coverImage : undefined,
    coverAlt: typeof frontmatter.coverAlt === "string" ? frontmatter.coverAlt : undefined,
    featured: frontmatter.featured === true,
    body: body.trim(),
    publishedAt: formatBlogDate(frontmatter.date),
  };
}

const blogPosts = Object.entries(markdownModules)
  .map(([path, rawMarkdown]) => parseMarkdownModule(rawMarkdown, path))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getAllBlogPosts() {
  return blogPosts;
}

export function getFeaturedBlogPost() {
  return blogPosts.find((post) => post.featured) ?? blogPosts[0];
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
