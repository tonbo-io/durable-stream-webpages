function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-lines" aria-hidden="true" />
      <div className="hero-content">
        <h1>sandbox is ephemeral your work lives long</h1>
        <p>
          <span>Run coding agents that never lose state.</span>
          <span>Persistent filesystem and durable sessions.</span>
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#demo">
            Try Demo
          </a>
          <a className="button button-secondary" href="#waitlist">
            Join Waitlist
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
