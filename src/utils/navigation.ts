export const HOME_PATH = "/";
export const PRICING_PATH = "/pricing";
export const BLOG_PATH = "/blogs";
export const BLOG_POST_PREFIX = "/blogs/";
export const DOCS_PATH = "/docs";
export const DOCS_PAGE_PREFIX = "/docs/";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function buildAppHref(path: string) {
  const normalizedPath = path === HOME_PATH ? HOME_PATH : path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath === HOME_PATH ? "/" : normalizedPath}`;
}

export function getCurrentAppPath(pathname?: string) {
  const resolvedPathname =
    pathname ?? (typeof window !== "undefined" ? window.location.pathname : HOME_PATH);
  const pathWithoutBase =
    basePath && resolvedPathname.startsWith(basePath)
      ? resolvedPathname.slice(basePath.length) || HOME_PATH
      : resolvedPathname;
  const normalizedPath = pathWithoutBase.replace(/\/+$/, "") || HOME_PATH;

  if (normalizedPath === PRICING_PATH) {
    return PRICING_PATH;
  }

  if (normalizedPath === BLOG_PATH) {
    return BLOG_PATH;
  }

  if (normalizedPath.startsWith(BLOG_POST_PREFIX) && normalizedPath !== BLOG_PATH) {
    return normalizedPath;
  }

  if (normalizedPath === DOCS_PATH) {
    return DOCS_PATH;
  }

  if (normalizedPath.startsWith(DOCS_PAGE_PREFIX) && normalizedPath !== DOCS_PATH) {
    return normalizedPath;
  }

  return HOME_PATH;
}

export function getBlogPostPath(slug: string) {
  return `${BLOG_PATH}/${slug}`;
}

export function getBlogSlugFromPath(path: string) {
  if (!path.startsWith(BLOG_POST_PREFIX) || path === BLOG_PATH) {
    return null;
  }

  return path.slice(BLOG_POST_PREFIX.length) || null;
}

export function getDocsPagePath(slug: string) {
  return `${DOCS_PATH}/${slug}`;
}

export function getDocsSlugFromPath(path: string) {
  if (path === DOCS_PATH) {
    return "";
  }

  if (!path.startsWith(DOCS_PAGE_PREFIX)) {
    return null;
  }

  return path.slice(DOCS_PAGE_PREFIX.length) || null;
}

export function isInternalAppPath(path: string) {
  return path.startsWith("/");
}

export function navigateTo(path: string) {
  const nextHref = buildAppHref(path);
  const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (currentHref === nextHref) {
    return;
  }

  window.history.pushState({}, "", nextHref);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "auto" });
}
