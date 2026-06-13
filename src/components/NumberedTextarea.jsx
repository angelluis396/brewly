import { useRef, useEffect, useState } from "react";

/**
 * NumberedTextarea — textarea with smart list features.
 *
 * Two modes:
 *  1. AUTO-NUMBER MODE (default): visual line numbers (1. 2. 3.) in a gutter on the left.
 *     Numbers are display-only and never saved to the value.
 *  2. USER-CONTROLLED MODE: if the FIRST non-empty line starts with a list marker
 *     ('1.', '1)', '*', '-', '•'), the gutter hides and the user controls their own
 *     list markers.
 *
 * Smart continuation (user-controlled mode only):
 *  - Press Enter on a line starting with '*' or '-' or '•' → next line auto-starts with same marker
 *  - Press Enter on '1.' → next line auto-starts with '2.', '3.', etc.
 *  - Press Enter on an EMPTY bullet line → removes the marker (exits the list)
 */
export default function NumberedTextarea({ value, onChange, placeholder, t, minHeight = 70 }) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const [computedHeight, setComputedHeight] = useState(minHeight);

  const detectUserControlled = (text) => {
    const firstLine = (text || "").split("\n").find(l => l.trim().length > 0) || "";
    const trimmed = firstLine.trimStart();
    return /^(\d+[.)]\s|[-*•]\s)/.test(trimmed);
  };

  const userControlled = detectUserControlled(value);
  const lines = (value || "").split("\n");

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const newHeight = Math.max(minHeight, ta.scrollHeight);
    ta.style.height = `${newHeight}px`;
    setComputedHeight(newHeight);
  }, [value, minHeight]);

  // ─── Smart list continuation on Enter ────────────────────────
  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    if (!userControlled) return;

    const ta = textareaRef.current;
    if (!ta) return;

    const cursor = ta.selectionStart;
    const text = ta.value;

    // Find the current line (from last newline before cursor to cursor)
    const beforeCursor = text.slice(0, cursor);
    const afterCursor = text.slice(cursor);
    const lineStart = beforeCursor.lastIndexOf("\n") + 1;
    const currentLine = beforeCursor.slice(lineStart);

    // Match list markers
    const bulletMatch = currentLine.match(/^(\s*)([-*•])\s(.*)$/);
    const numberMatch = currentLine.match(/^(\s*)(\d+)([.)])\s(.*)$/);

    if (bulletMatch) {
      const [, indent, marker, content] = bulletMatch;
      if (content.trim() === "") {
        // Empty bullet line — exit the list
        e.preventDefault();
        const newText = text.slice(0, lineStart) + "\n" + afterCursor;
        onChange(newText);
        // Position cursor after the new line break
        setTimeout(() => {
          ta.selectionStart = ta.selectionEnd = lineStart + 1;
        }, 0);
      } else {
        // Continue the bullet
        e.preventDefault();
        const insert = `\n${indent}${marker} `;
        const newText = beforeCursor + insert + afterCursor;
        onChange(newText);
        setTimeout(() => {
          ta.selectionStart = ta.selectionEnd = cursor + insert.length;
        }, 0);
      }
      return;
    }

    if (numberMatch) {
      const [, indent, num, punct, content] = numberMatch;
      if (content.trim() === "") {
        // Empty numbered line — exit the list
        e.preventDefault();
        const newText = text.slice(0, lineStart) + "\n" + afterCursor;
        onChange(newText);
        setTimeout(() => {
          ta.selectionStart = ta.selectionEnd = lineStart + 1;
        }, 0);
      } else {
        // Continue with next number
        e.preventDefault();
        const nextNum = parseInt(num, 10) + 1;
        const insert = `\n${indent}${nextNum}${punct} `;
        const newText = beforeCursor + insert + afterCursor;
        onChange(newText);
        setTimeout(() => {
          ta.selectionStart = ta.selectionEnd = cursor + insert.length;
        }, 0);
      }
      return;
    }
  };

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const gutterWidth = 32;
  const lineHeightPx = 20;

  return (
    <div style={{
      position: "relative",
      width: "100%",
      border: `1px solid ${t.border}`,
      borderRadius: 12,
      background: "transparent",
      overflow: "hidden",
    }}>
      {!userControlled && (
        <div
          ref={lineNumbersRef}
          style={{
            position: "absolute",
            top: 0, left: 0, bottom: 0,
            width: gutterWidth,
            padding: "12px 0 12px 12px",
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            color: t.accent,
            lineHeight: `${lineHeightPx}px`,
            pointerEvents: "none",
            overflow: "hidden",
            textAlign: "left",
            userSelect: "none",
          }}
        >
          {lines.map((_, i) => (
            <div key={i} style={{ height: lineHeightPx }}>
              {i + 1}.
            </div>
          ))}
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: userControlled
            ? "12px 14px"
            : `12px 14px 12px ${gutterWidth + 12}px`,
          background: "transparent",
          border: "none",
          fontFamily: "'Outfit', sans-serif",
          fontSize: 13,
          color: t.text,
          resize: "none",
          outline: "none",
          minHeight,
          lineHeight: `${lineHeightPx}px`,
          display: "block",
        }}
      />
    </div>
  );
}