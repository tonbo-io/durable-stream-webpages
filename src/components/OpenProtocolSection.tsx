function OpenProtocolSection() {
  return (
    <section className="homepage-section protocol-section">
      <div className="section-mark section-mark-centered">Open protocol</div>

      <div className="protocol-header">
        <h2>Built on open HTTP.</h2>
        <p>POST to append, GET to read, SSE to subscribe. No SDK required.</p>
      </div>

      <div className="protocol-card">
        <div className="protocol-code-block">
          <div className="protocol-code-line">
            <span className="code-token-http-method">POST</span>
            <span className="code-token-default"> /v1/sessions/{"{session_id}"}/events </span>
            <span className="code-token-http-method">HTTP</span>
            <span className="code-token-default">/</span>
            <span className="code-token-number">1.1</span>
          </div>

          <div className="protocol-code-line">
            <span className="code-token-header-name">Content-Type</span>
            <span className="code-token-http-method">:</span>
            <span className="code-token-header-value"> application/json</span>
          </div>

          <div className="protocol-code-line" aria-hidden="true">
            {" "}
          </div>

          <div className="protocol-code-line">
            <span className="code-token-punctuation">{"{ "}</span>
            <span className="code-token-punctuation">"</span>
            <span className="code-token-key">type</span>
            <span className="code-token-punctuation">"</span>
            <span className="code-token-punctuation">:</span>
            <span className="code-token-punctuation"> "</span>
            <span className="code-token-string">tool_call</span>
            <span className="code-token-punctuation">"</span>
            <span className="code-token-punctuation">, </span>
            <span className="code-token-punctuation">"</span>
            <span className="code-token-key">name</span>
            <span className="code-token-punctuation">"</span>
            <span className="code-token-punctuation">:</span>
            <span className="code-token-punctuation"> "</span>
            <span className="code-token-string">edit_file</span>
            <span className="code-token-punctuation">"</span>
            <span className="code-token-punctuation">, </span>
            <span className="code-token-punctuation">"</span>
            <span className="code-token-key">data</span>
            <span className="code-token-punctuation">"</span>
            <span className="code-token-punctuation">:</span>
            <span className="code-token-punctuation"> {"{"}</span>
            <span className="code-token-ellipsis">...</span>
            <span className="code-token-punctuation">{"} }"}</span>
          </div>

          <div className="protocol-code-line" aria-hidden="true">
            {" "}
          </div>

          <div className="protocol-code-line">
            <span className="code-token-default">HTTP/</span>
            <span className="code-token-number">1.1</span>
            <span className="code-token-number"> 204</span>
            <span className="code-token-default"> No Content</span>
          </div>

          <div className="protocol-code-line">
            <span className="code-token-default">Stream-Next-Offset: </span>
            <span className="code-token-number">00000145</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OpenProtocolSection;
