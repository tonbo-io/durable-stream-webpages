import { buildAppHref, getBlogPostPath, navigateTo } from "../utils/navigation";

function Hero() {
  const howItWorksPath = getBlogPostPath("ghost-outside-the-shell");
  const handleHowItWorksClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigateTo(howItWorksPath);
  };

  return (
    <section className="hero-section">
      <div className="hero-lines" aria-hidden="true" />
      <div className="hero-content">
        <h1>Sessions outlive the harness</h1>
        <p>
          <span>Persist agent events in remote streams</span>
          <span>and resume execution for long-running agents.</span>
        </p>
        <div className="hero-actions">
          <a className="button button-terminal button-terminal-primary hero-primary-cta" href="https://cal.com/tzu-gwo/hi-from-tonbo">
            [ Book demo ]
          </a>
          <a className="hero-secondary-cta" href={buildAppHref(howItWorksPath)} onClick={handleHowItWorksClick}>
            Read the post →
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
