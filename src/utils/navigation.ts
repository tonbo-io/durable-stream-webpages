export const HOME_PATH = "/";
export const PRICING_PATH = "/pricing";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function buildAppHref(path: string) {
  const normalizedPath = path === HOME_PATH ? HOME_PATH : path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath === HOME_PATH ? "/" : normalizedPath}`;
}

export function getCurrentAppPath(pathname = window.location.pathname) {
  const pathWithoutBase =
    basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) || HOME_PATH : pathname;
  const normalizedPath = pathWithoutBase.replace(/\/+$/, "") || HOME_PATH;

  return normalizedPath === PRICING_PATH ? PRICING_PATH : HOME_PATH;
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
