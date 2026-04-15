import { useEffect, useState } from "react";
import { getBlogPostBySlug } from "./content/blog";
import { getDocsPageBySlug } from "./content/docs";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import DocsPage from "./pages/DocsPage";
import HomePage from "./pages/HomePage";
import PricingPage from "./pages/PricingPage";
import {
  BLOG_PATH,
  DOCS_PATH,
  getBlogSlugFromPath,
  getCurrentAppPath,
  getDocsSlugFromPath,
  PRICING_PATH,
} from "./utils/navigation";

type AppProps = {
  initialUrl?: string;
};

function App({ initialUrl }: AppProps) {
  const [currentPath, setCurrentPath] = useState(() => getCurrentAppPath(initialUrl));
  const currentBlogSlug = getBlogSlugFromPath(currentPath);
  const currentBlogPost = currentBlogSlug ? getBlogPostBySlug(currentBlogSlug) : undefined;
  const currentDocsSlug = getDocsSlugFromPath(currentPath);
  const currentDocsPage = currentDocsSlug !== null ? getDocsPageBySlug(currentDocsSlug) : undefined;

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(getCurrentAppPath());
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  useEffect(() => {
    document.title =
      currentPath === PRICING_PATH
        ? "Pricing | Durable Sessions"
        : currentPath === BLOG_PATH
          ? "Blogs | Durable Sessions"
          : currentBlogPost
            ? `${currentBlogPost.title} | Durable Sessions`
            : currentDocsPage
              ? `${currentDocsPage.title} | Durable Sessions`
              : currentPath === DOCS_PATH
                ? "Docs | Durable Sessions"
                : "Durable Sessions";
  }, [currentBlogPost, currentDocsPage, currentPath]);

  return (
    <div className="page-shell">
      {currentPath === PRICING_PATH ? (
        <PricingPage />
      ) : currentPath === BLOG_PATH ? (
        <BlogPage />
      ) : currentBlogPost ? (
        <BlogPostPage post={currentBlogPost} />
      ) : currentDocsPage ? (
        <DocsPage page={currentDocsPage} />
      ) : (
        <HomePage />
      )}
    </div>
  );
}

export default App;
