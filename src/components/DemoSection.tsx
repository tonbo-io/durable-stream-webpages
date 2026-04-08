import { useState } from "react";
import checkIcon from "../assets/check.svg";

const benefits = [
  "Recover from sandbox restart",
  "Survive in unexpected crashes",
  "Scale with no time and cost limits",
  "No sandbox vendor lock-in",
];

const tabs = ["Lian", "E2B", "Daytona"];

function DemoSection() {
  const [activeTab, setActiveTab] = useState("Lian");

  return (
    <section className="demo-section" id="demo">
      <div className="demo-copy">
        <div className="demo-copy-main">
          <h2>
            Make <span>background</span> agents work forever
          </h2>
          <p className="demo-description">
            Agents work in disposal sandboxes. Runtime and sessions persists in S3,
            making it.
          </p>
          <ul className="benefit-list">
            {benefits.map((benefit) => (
              <li key={benefit}>
                <img src={checkIcon} alt="" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="demo-tabs-wrap">
          <div className="demo-tabs" role="tablist" aria-label="Sandbox providers">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "demo-tab active" : "demo-tab"}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <p className="demo-footnote">Switch sandbox with one click</p>
        </div>
      </div>

      <div className="demo-shell" aria-label="Future opencode demo area">
        <div className="demo-shell-top" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="demo-shell-screen">
          <div className="demo-shell-stage">
            <p className="opencode-mark">opencode</p>
          </div>
          <p className="demo-shell-caption">
            We use a coding agent for display the long work sessions
          </p>
        </div>
      </div>
    </section>
  );
}

export default DemoSection;
