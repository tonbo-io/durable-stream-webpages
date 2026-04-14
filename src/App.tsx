import { useEffect, useState } from "react";
import { getBlogPostBySlug } from "./content/blog";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import HomePage from "./pages/HomePage";
import PricingPage from "./pages/PricingPage";
import { BLOG_PATH, getBlogSlugFromPath, getCurrentAppPath, PRICING_PATH } from "./utils/navigation";

function App() {
  const [currentPath, setCurrentPath] = useState(() => getCurrentAppPath());
  const currentBlogSlug = getBlogSlugFromPath(currentPath);
  const currentBlogPost = currentBlogSlug ? getBlogPostBySlug(currentBlogSlug) : undefined;

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
        ? "Pricing | Long Code"
        : currentPath === BLOG_PATH
          ? "Blog | Long Code"
          : currentBlogPost
            ? `${currentBlogPost.title} | Long Code`
            : "Long Code";
  }, [currentBlogPost, currentPath]);

  return (
    <div className="page-shell">
      {currentPath === PRICING_PATH ? (
        <PricingPage />
      ) : currentPath === BLOG_PATH ? (
        <BlogPage />
      ) : currentBlogPost ? (
        <BlogPostPage post={currentBlogPost} />
      ) : (
        <HomePage />
      )}
    </div>
  );
}

export default App;
