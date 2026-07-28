import { useEffect, useRef } from "react";

// A generic slot for pasting third-party ad network embed codes (Adsterra,
// or any other network that gives you a <script> snippet to paste).
//
// Why this exists: React ignores <script> tags inside dangerouslySetInnerHTML
// for security reasons, so a raw paste of an ad network's code would not
// actually run. This component re-creates each <script> tag manually so the
// ad network's code executes normally, exactly like it would on a plain
// HTML page.
export default function AdSlot({ html, className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !html) return;
    containerRef.current.innerHTML = "";

    const temp = document.createElement("div");
    temp.innerHTML = html;

    Array.from(temp.childNodes).forEach((node) => {
      if (node.nodeType === 1 && node.tagName === "SCRIPT") {
        const script = document.createElement("script");
        Array.from(node.attributes).forEach((attr) =>
          script.setAttribute(attr.name, attr.value)
        );
        script.text = node.textContent;
        containerRef.current.appendChild(script);
      } else {
        containerRef.current.appendChild(node.cloneNode(true));
      }
    });
  }, [html]);

  if (!html) return null;

  return <div ref={containerRef} className={className} />;
}
