import CallToActionSection from "../components/CallToActionSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import HowItWorksSection from "../components/HowItWorksSection";
import IngestionStreamSection from "../components/IngestionStreamSection";
import OpenProtocolSection from "../components/OpenProtocolSection";
import SearchHistorySection from "../components/SearchHistorySection";

function HomePage() {
  return (
    <>
      <Header
        navItems={[
          { label: "Pricing", href: "/pricing" },
          { label: "Docs", href: "/docs" },
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
      <main className="page-content homepage-content">
        <Hero />
        <HowItWorksSection />
        <IngestionStreamSection />
        <OpenProtocolSection />
        <SearchHistorySection />
        <CallToActionSection />
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
