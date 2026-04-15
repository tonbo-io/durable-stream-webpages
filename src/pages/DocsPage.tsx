import type { DocsPage as DocsPageType } from "../content/docs";
import DocsLayout from "../components/docs/DocsLayout";
import Footer from "../components/Footer";
import Header from "../components/Header";

type DocsPageProps = {
  page: DocsPageType;
};

function DocsPage({ page }: DocsPageProps) {
  const Content = page.Component;

  return (
    <>
      <Header
        navItems={[
          { label: "Pricing", href: "/pricing" },
          { label: "Docs", href: "/docs", active: true },
          { label: "Blogs", href: "/blogs" },
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

      <DocsLayout activeSlug={page.slug} title={page.title} description={page.description}>
        <Content />
      </DocsLayout>

      <Footer />
    </>
  );
}

export default DocsPage;
