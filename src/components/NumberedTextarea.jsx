import { useRef, useEffect, useState } from "react";

/**
 * NumberedTextarea — a textarea that shows visual line numbers (1. 2. 3.) by default.
 *
 * Smart detection: if the user's FIRST line starts with a list marker like '1.',
 * '*', or '-', the auto-numbering turns off entirely and the user controls the
 * list themselves. This lets power users use markdown-style bullets.
 *
 * Numbers are display-only — they're not part of the saved value.
 *
 * Props:
 *  - value: current text value
 *  - onChange: (newValue) => void
 *  - placeholder: optional placeholder text
 *  - t: theme object
 *  - minHeight: optional override (default 70px)
 */
export default function NumberedTextarea({ value, onChange, placeholder, t, minHeight = 70 }) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const [computedHeight, setComputedHeight] = useState(minHeight);

  // Detect mode: if the first non-empty line starts with a marker, hide numbers
  const detectUserControlled = (text) => {
    const firstLine = (text || "").split("\n").find(l => l.trim().length > 0) || "";
    const trimmed = firstLine.trimStart();
    // Check for: "1.", "1)", "-", "*", "•"
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

  // Sync scroll between line numbers and textarea
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
      {/* Line numbers gutter (only shown when not user-controlled) */}
      {!userControlled && (
        <div
          ref={lineNumbersRef}
          style={{
            position: "absolute",
            top: 0, left: 0, bottom: 0,
            width: gutterWidth,
            padding: "12px 0 12px 12px",
            paddingTop: 12,
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