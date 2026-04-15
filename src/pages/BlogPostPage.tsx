import MarkdownContent from "../components/MarkdownContent";
import Footer from "../components/Footer";
import Header from "../components/Header";
import type { BlogPost } from "../content/blog";
import { BLOG_PATH, buildAppHref, navigateTo } from "../utils/navigation";

type BlogPostPageProps = {
  post: BlogPost;
};

const ORIGIN = "https://sessions.tonbo.io";

function BlogPostPage({ post }: BlogPostPageProps) {
  const handleMetaClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigateTo(BLOG_PATH);
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.subtitle ?? post.summary,
    image: post.coverImage ? `${ORIGIN}${post.coverImage}` : undefined,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Tzu Gwo",
    },
    publisher: {
      "@type": "Organization",
      name: "Durable Sessions",
      url: ORIGIN,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${ORIGIN}/blogs/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header
        navItems={[
          { label: "Pricing", href: "/pricing" },
          { label: "Docs", href: "/docs" },
          { label: "Blogs", href: "/blogs", active: true },
          {
            label: "Projects",
            caret: true,
            children: [
              { label: "Tonbo", href: "https://tonbo.io/" },
              { label: "Harness", href: "https://harness.tonbo.dev/" },
            ],
          },
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

        <article className="blog-detail-shell blog-detail-content" data-pagefind-body>
          <MarkdownContent className="blog-detail-prose markdown-content" markdown={post.body} />
        </article>
      </main>

      <Footer />
    </>
  );
}

export default BlogPostPage;
