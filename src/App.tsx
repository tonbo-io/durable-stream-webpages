import Header from "./components/Header";
import Hero from "./components/Hero";
import DemoSection from "./components/DemoSection";
import UseExamples from "./components/UseExamples";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="page-shell">
      <Header />
      <main className="page-content">
        <Hero />
        <DemoSection />
        <UseExamples />
      </main>
      <Footer />
    </div>
  );
}

export default App;
