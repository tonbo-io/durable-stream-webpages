import sandboxIcon from "../assets/sandbox-icon.svg";
import shareIcon from "../assets/share-2-icon.svg";
import trendIcon from "../assets/trend icon.svg";

const lianSandboxes = [
  "sandbox",
  "sandbox",
  "sandbox",
  "sandbox",
  "ellipsis",
  "sandbox",
  "sandbox",
  "sandbox",
] as const;

function UseExamples() {
  return (
    <section className="use-examples-section">
      <div className="use-examples-header">
        <h2>
          Your Stack <span>{"\u00A0\u00A0×\u00A0\u00A0"}</span> Snakream
        </h2>
        <p>Unlock capabilities you couldn’t build before</p>
      </div>

      <div className="use-case-grid">
        <article className="use-case-card use-case-card-lian">
          <div className="use-case-top-group">
            <h3>Lian × Snakream</h3>
            <div className="sandbox-row" aria-hidden="true">
              {lianSandboxes.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className={
                    item === "ellipsis" ? "sandbox-box sandbox-box-muted" : "sandbox-box"
                  }
                >
                  {item === "ellipsis" ? <span>...</span> : <img src={sandboxIcon} alt="" />}
                </div>
              ))}
            </div>
          </div>

          <div className="use-case-bottom-group">
            <p className="use-case-description use-case-description-lian">
              Turn sandboxes into a recoverable, serverless runtime. Inspect and
              time-travel environment and dependency states with Lian.
            </p>
            <a className="use-case-link" href="#templates-lian">
              View Templates →
            </a>
          </div>
        </article>

        <article className="use-case-card use-case-card-monitor">
          <div className="use-case-top-group">
            <h3>
              <span>infinite-monitor</span>
              <span>× Snakream</span>
            </h3>
            <div className="monitor-flow" aria-hidden="true">
              <div className="monitor-card monitor-card-large">
                <span className="monitor-card-top" />
                <img className="monitor-icon" src={trendIcon} alt="" />
              </div>
              <img className="monitor-share-icon" src={shareIcon} alt="" />
              <div className="monitor-card monitor-card-small">
                <span className="monitor-card-top" />
                <img className="monitor-icon" src={trendIcon} alt="" />
              </div>
            </div>
          </div>

          <div className="use-case-bottom-group">
            <p className="use-case-description use-case-description-monitor">
              Stream and replay agent-generated UI, context and state with no backend
              required. Powered by infinite-monitor and Snakream
            </p>
            <a className="use-case-link" href="#templates-monitor">
              View Templates →
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}

export default UseExamples;
