export const HOME_PATH = "/";
export const PRICING_PATH = "/pricing";
export const BLOG_PATH = "/blog";
export const BLOG_POST_PREFIX = "/blog/";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function buildAppHref(path: string) {
  const normalizedPath = path === HOME_PATH ? HOME_PATH : path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath === HOME_PATH ? "/" : normalizedPath}`;
}

export function getCurrentAppPath(pathname = window.location.pathname) {
  const pathWithoutBase =
    basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) || HOME_PATH : pathname;
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
