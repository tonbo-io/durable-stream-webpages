import type { ComponentType } from "react";

export type DocsPageMeta = {
  slug: string;
  title: string;
  description?: string;
  group: string;
  order: number;
};

export type DocsPage = DocsPageMeta & {
  Component: ComponentType;
};

export type DocsGroup = {
  name: string;
  pages: DocsPage[];
};

type MdxModule = {
  default: ComponentType;
  frontmatter?: {
    slug?: string;
    title?: string;
    description?: string;
    group?: string;
    order?: number;
  };
};

const docsModules = import.meta.glob<MdxModule>("./pages/**/*.mdx", { eager: true });

function inferSlug(path: string) {
  return path
    .replace(/^\.\/pages\//, "")
    .replace(/\.mdx$/, "")
    .replace(/\/index$/, "");
}

function buildPage(path: string, mod: MdxModule): DocsPage {
  const fallbackSlug = inferSlug(path);
  const frontmatter = mod.frontmatter ?? {};

  const slug = frontmatter.slug ?? fallbackSlug;
  const title = frontmatter.title;
  const group = frontmatter.group ?? "Reference";
  const order = frontmatter.order ?? 999;

  if (!title) {
    throw new Error(`Docs page is missing a title in frontmatter: ${path}`);
  }

  return {
    slug,
    title,
    description: frontmatter.description,
    group,
    order,
    Component: mod.default,
  };
}

const docsPages: DocsPage[] = Object.entries(docsModules)
  .map(([path, mod]) => buildPage(path, mod))
  .sort((a, b) => {
    if (a.group !== b.group) {
      return a.group.localeCompare(b.group);
    }
    return a.order - b.order;
  });

const groupOrder = ["Get started", "Guides", "API reference", "Protocol", "Release notes"];

export function getAllDocsPages(): DocsPage[] {
  return docsPages;
}

export function getDocsPageBySlug(slug: string): DocsPage | undefined {
  if (slug === "") {
    return docsPages.find((page) => page.slug === "overview") ?? docsPages[0];
  }
  return docsPages.find((page) => page.slug === slug);
}

export function getDocsGroups(): DocsGroup[] {
  const map = new Map<string, DocsPage[]>();

  for (const page of docsPages) {
    const list = map.get(page.group) ?? [];
    list.push(page);
    map.set(page.group, list);
  }

  return Array.from(map.entries())
    .map(([name, pages]) => ({
      name,
      pages: pages.sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => {
      const indexA = groupOrder.indexOf(a.name);
      const indexB = groupOrder.indexOf(b.name);
      if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
}
