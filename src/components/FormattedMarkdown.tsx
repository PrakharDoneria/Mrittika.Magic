import React from "react";

export function FormattedMarkdown({ content, className }: { content: string; className?: string }) {
  if (!content) return null;

  // Split by double line breaks to form paragraphs
  const paragraphs = content.split(/\n\s*\n/);

  return (
    <div className={className}>
      {paragraphs.map((p, pIdx) => {
        // Split by single line breaks
        const lines = p.split("\n");
        return (
          <p key={pIdx} style={{ marginBottom: "0.85em" }}>
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {parseFormattedText(line)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function parseFormattedText(text: string): React.ReactNode[] {
  // Regex to match:
  // **bold** or __bold__
  // *italic* or _italic_
  // `code`
  const tokens: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|__[^_]+__|(?<!\*)\*[^*]+(?!\*)|(?<!_)_[^_]+(?!_)|`[^`]+`)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith("**") && matchedStr.endsWith("**")) {
      tokens.push(
        <strong key={match.index} style={{ fontWeight: 800 }}>
          {matchedStr.slice(2, -2)}
        </strong>
      );
    } else if (matchedStr.startsWith("__") && matchedStr.endsWith("__")) {
      tokens.push(
        <strong key={match.index} style={{ fontWeight: 800 }}>
          {matchedStr.slice(2, -2)}
        </strong>
      );
    } else if (matchedStr.startsWith("*") && matchedStr.endsWith("*")) {
      tokens.push(
        <em key={match.index} style={{ fontStyle: "italic" }}>
          {matchedStr.slice(1, -1)}
        </em>
      );
    } else if (matchedStr.startsWith("_") && matchedStr.endsWith("_")) {
      tokens.push(
        <em key={match.index} style={{ fontStyle: "italic" }}>
          {matchedStr.slice(1, -1)}
        </em>
      );
    } else if (matchedStr.startsWith("`") && matchedStr.endsWith("`")) {
      tokens.push(
        <code key={match.index} style={{ background: "rgba(0,0,0,0.06)", padding: "2px 6px", borderRadius: 4 }}>
          {matchedStr.slice(1, -1)}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return tokens;
}

