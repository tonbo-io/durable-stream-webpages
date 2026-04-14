import MarkdownContent from "../components/MarkdownContent";
import Footer from "../components/Footer";
import Header from "../components/Header";
import type { BlogPost } from "../content/blog";
import { BLOG_PATH, buildAppHref, navigateTo } from "../utils/navigation";

type BlogPostPageProps = {
  post: BlogPost;
};

function BlogPostPage({ post }: BlogPostPageProps) {
  const handleMetaClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigateTo(BLOG_PATH);
  };

  return (
    <>
      <Header
        navItems={[
          { label: "Pricing", href: "/pricing" },
          { label: "Docs", disabled: true },
          { label: "Blog", href: "/blog", active: true },
          { label: "Projects", disabled: true, caret: true },
        ]}
      />

      <main className="blog-detail-page">
        <section className="blog-detail-shell blog-detail-hero">
          <a className="blog-detail-meta-link" href={buildAppHref(BLOG_PATH)} onClick={handleMetaClick}>
            <p className="blog-detail-meta">
              <span className="blog-detail-category">{post.category}</span>
              <span className="blog-detail-date">{post.publishedAt}</span>
            </p>
          </a>

          <div className="blog-detail-title-group">
            <h1>{post.title}</h1>
            <p>{post.subtitle}</p>
          </div>
        </section>

        <article className="blog-detail-shell blog-detail-content">
          <MarkdownContent className="blog-detail-prose markdown-content" markdown={post.body} />
        </article>
      </main>

      <Footer />
    </>
  );
}

export default BlogPostPage;
