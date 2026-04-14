import { Fragment } from "react";

type MarkdownContentProps = {
  className?: string;
  markdown: string;
};

type MarkdownBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "blockquote"; text: string }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "code"; code: string; language?: string }
  | { type: "image"; alt: string; src: string }
  | { type: "divider" };

type InlineToken =
  | { type: "text"; text: string }
  | { type: "strong"; text: string }
  | { type: "emphasis"; text: string }
  | { type: "code"; text: string }
  | { type: "link"; href: string; text: string };

function parseBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.split(/\r?\n/);
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  const collectParagraph = () => {
    const paragraphLines: string[] = [];

    while (index < lines.length && lines[index].trim() !== "") {
      if (
        /^(#{1,3})\s+/.test(lines[index]) ||
        /^>\s?/.test(lines[index]) ||
        /^```/.test(lines[index]) ||
        /^[-*]\s+/.test(lines[index]) ||
        /^\d+\.\s+/.test(lines[index]) ||
        /^!\[.*\]\(.*\)$/.test(lines[index].trim()) ||
        /^---+$/.test(lines[index].trim())
      ) {
        break;
      }

      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    if (paragraphLines.length > 0) {
      blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
    }
  };

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    const codeMatch = lines[index].match(/^```(\w+)?$/);

    if (codeMatch) {
      index += 1;
      const codeLines: string[] = [];

      while (index < lines.length && !/^```$/.test(lines[index].trim())) {
        codeLines.push(lines[index]);
        index += 1;
      }

      index += 1;
      blocks.push({
        type: "code",
        code: codeLines.join("\n"),
        language: codeMatch[1],
      });
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);

    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length as 1 | 2 | 3,
        text: headingMatch[2],
      });
      index += 1;
      continue;
    }

    if (/^---+$/.test(line)) {
      blocks.push({ type: "divider" });
      index += 1;
      continue;
    }

    const imageMatch = line.match(/^!\[(.*)\]\((.*)\)$/);

    if (imageMatch) {
      blocks.push({
        type: "image",
        alt: imageMatch[1],
        src: imageMatch[2],
      });
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];

      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }

      blocks.push({ type: "blockquote", text: quoteLines.join(" ") });
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];

      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }

      blocks.push({ type: "unordered-list", items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];

      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }

      blocks.push({ type: "ordered-list", items });
      continue;
    }

    collectParagraph();
  }

  return blocks;
}

function findNextInlineMatch(text: string) {
  const patterns = [
    { type: "code" as const, regex: /`([^`]+)`/ },
    { type: "strong" as const, regex: /\*\*([^*]+)\*\*/ },
    { type: "emphasis" as const, regex: /\*([^*]+)\*/ },
    { type: "link" as const, regex: /\[([^\]]+)\]\(([^)]+)\)/ },
  ];

  return patterns
    .map((pattern) => {
      const match = pattern.regex.exec(text);
      return match ? { ...pattern, match } : null;
    })
    .filter((value): value is NonNullable<typeof value> => Boolean(value))
    .sort((a, b) => a.match.index - b.match.index)[0];
}

function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let remainingText = text;

  while (remainingText.length > 0) {
    const nextMatch = findNextInlineMatch(remainingText);

    if (!nextMatch) {
      tokens.push({ type: "text", text: remainingText });
      break;
    }

    const { match, type } = nextMatch;
    const matchIndex = match.index;

    if (matchIndex > 0) {
      tokens.push({ type: "text", text: remainingText.slice(0, matchIndex) });
    }

    if (type === "link") {
      tokens.push({ type: "link", text: match[1], href: match[2] });
    } else {
      tokens.push({ type, text: match[1] } as InlineToken);
    }

    remainingText = remainingText.slice(matchIndex + match[0].length);
  }

  return tokens;
}

function renderInline(text: string) {
  return parseInline(text).map((token, index) => {
    switch (token.type) {
      case "text":
        return <Fragment key={`${token.type}-${index}`}>{token.text}</Fragment>;
      case "strong":
        return <strong key={`${token.type}-${index}`}>{token.text}</strong>;
      case "emphasis":
        return <em key={`${token.type}-${index}`}>{token.text}</em>;
      case "code":
        return <code key={`${token.type}-${index}`}>{token.text}</code>;
      case "link":
        return token.href.startsWith("http") ? (
          <a href={token.href} key={`${token.type}-${index}`} rel="noreferrer" target="_blank">
            {token.text}
          </a>
        ) : (
          <a href={token.href} key={`${token.type}-${index}`}>
            {token.text}
          </a>
        );
      default:
        return null;
    }
  });
}

function MarkdownContent({ className, markdown }: MarkdownContentProps) {
  const blocks = parseBlocks(markdown);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return <p key={`paragraph-${index}`}>{renderInline(block.text)}</p>;
          case "heading": {
            if (block.level === 1) {
              return <h1 key={`heading-${index}`}>{renderInline(block.text)}</h1>;
            }

            if (block.level === 2) {
              return <h2 key={`heading-${index}`}>{renderInline(block.text)}</h2>;
            }

            return <h3 key={`heading-${index}`}>{renderInline(block.text)}</h3>;
          }
          case "blockquote":
            return <blockquote key={`blockquote-${index}`}>{renderInline(block.text)}</blockquote>;
          case "unordered-list":
            return (
              <ul key={`unordered-${index}`}>
                {block.items.map((item) => (
                  <li key={item}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case "ordered-list":
            return (
              <ol key={`ordered-${index}`}>
                {block.items.map((item) => (
                  <li key={item}>{renderInline(item)}</li>
                ))}
              </ol>
            );
          case "code":
            return (
              <pre key={`code-${index}`}>
                <code data-language={block.language}>{block.code}</code>
              </pre>
            );
          case "image":
            return (
              <figure className="markdown-image-wrap" key={`image-${index}`}>
                <img alt={block.alt} className="markdown-image" src={block.src} />
              </figure>
            );
          case "divider":
            return <hr key={`divider-${index}`} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

export default MarkdownContent;
