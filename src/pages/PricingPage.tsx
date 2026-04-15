import checkIcon from "../assets/check.svg";
import Footer from "../components/Footer";
import Header from "../components/Header";

const introPoints = [
  "Free trial with no credit card required",
  "Up to $100 in free credits to start",
  "Pay as you go with usage-based pricing",
];

const pricingPlans = [
  {
    name: "Pay as you go",
    description: "Usage-based billing that scales with your workload — no seats, no minimums.",
    rates: [
      { label: "Writes", value: "$0.10 / GB" },
      { label: "Reads", value: "$0.05 / GB" },
      { label: "Storage", value: "$0.15 / GB / mo" },
    ],
    features: [
      "Unlimited sessions",
      "Full API access",
      "Configurable Retention",
      "Data export",
      "No operation charges",
      "No per-seat fees",
      "No minimum spend",
      "99.99% SLA",
    ],
    ctaLabel: "[ Book demo ]",
    ctaHref: "https://cal.com/tzu-gwo/hi-from-tonbo",
    ctaVariant: "primary" as const,
  },
  {
    name: "Custom pricing",
    description: "For enterprise requirements like SOC 2, auditing, and BYOC.",
    rates: [],
    features: [
      "SOC 2 Type II",
      "Encryption (BYOK)",
      "Audit log",
      "Self-hosted deployment",
      "Dedicated support",
    ],
    ctaLabel: "Contact Us",
    ctaHref: "mailto:contact@tonbo.io",
    ctaVariant: "secondary" as const,
  },
];

function PricingPage() {
  return (
    <>
      <Header
        navItems={[
          { label: "Pricing", href: "/pricing", active: true },
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

      <main className="pricing-page">
        <section className="pricing-hero">
          <div className="pricing-shell pricing-hero-shell">
            <h1>Start for free, designed to scale</h1>

            <ul className="pricing-intro-list">
              {introPoints.map((point) => (
                <li key={point}>
                  <img src={checkIcon} alt="" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <a className="button button-terminal button-terminal-primary pricing-hero-cta" href="https://cal.com/tzu-gwo/hi-from-tonbo">
              [ Book demo ]
            </a>
          </div>
        </section>

        <section className="pricing-plans-section">
          <div className="pricing-shell pricing-plan-list">
            {pricingPlans.map((plan) => (
              <article className="pricing-plan-card" key={plan.name}>
                <div className="pricing-plan-summary">
                  <div className="pricing-plan-copy">
                    <h2>{plan.name}</h2>
                    <p>{plan.description}</p>
                  </div>

                  {plan.rates.length > 0 ? (
                    <dl className="pricing-rate-list">
                      {plan.rates.map((rate) => (
                        <div className="pricing-rate-row" key={rate.label}>
                          <dt>{rate.label}</dt>
                          <dd>{rate.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  <a
                    className={
                      plan.ctaVariant === "primary"
                        ? "button button-terminal button-terminal-primary pricing-plan-cta"
                        : "button button-terminal button-terminal-secondary pricing-plan-cta"
                    }
                    href={plan.ctaHref}
                  >
                    {plan.ctaLabel}
                  </a>
                </div>

                <div className="pricing-plan-features">
                  <ul className="pricing-feature-list">
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <img src={checkIcon} alt="" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default PricingPage;
