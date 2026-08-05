// A tiny, SAFE formatter for admin-entered text. It intentionally does NOT
// use dangerouslySetInnerHTML or accept raw HTML - it only recognizes two
// simple patterns and turns them into real React elements:
//
//   **bold text**              -> <strong>bold text</strong>
//   [link text](https://...)   -> <a href="https://...">link text</a>
//
// Any real line breaks the admin typed (pressing Enter in the textarea)
// are preserved as line breaks. Nothing else is interpreted, so there's no
// way to inject scripts or arbitrary markup through this field.
export default function RichText({ text }) {
  if (!text) return null;

  const lines = text.split("\n");

  return (
    <>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex}>
          {renderLine(line)}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

function renderLine(line) {
  // Combined pattern: bold (**...**) OR a link ([text](url))
  const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index));
    }

    if (match[1] !== undefined) {
      // **bold**
      parts.push(<strong key={key++}>{match[1]}</strong>);
    } else {
      // [text](url)
      parts.push(
        <a
          key={key++}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-700 underline"
        >
          {match[2]}
        </a>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return parts;
}
