import DemoSection from "../components/DemoSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import UseExamples from "../components/UseExamples";

function HomePage() {
  return (
    <>
      <Header
        navItems={[
          { label: "Pricing", href: "/pricing" },
          { label: "Docs", href: "#docs" },
          { label: "Lian", href: "#demo" },
        ]}
        ctaHref="#waitlist"
        ctaLabel="Start Project"
        showDiscord
      />
      <main className="page-content">
        <Hero />
        <DemoSection />
        <UseExamples />
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
