import { useState } from "react";

export default function InfoIcon({ message, t }) {
  const [open, setOpen] = useState(false);

  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <span
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        style={{
          width: 14, height: 14, borderRadius: "50%",
          border: `1px solid ${t.textDim}`,
          color: t.textMuted,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontStyle: "italic", fontFamily: "Georgia, serif",
          cursor: "pointer", userSelect: "none",
        }}
      >
        i
      </span>
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 100 }}
          />
          <div style={{
            position: "absolute",
            top: "calc(100% + 8px)", left: -8,
            background: "#1C1A13",
            color: "#F2EDE4",
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: 11, fontWeight: 300, lineHeight: 1.4,
            width: 220,
            zIndex: 101,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}>
            <div style={{
              position: "absolute", top: -5, left: 12,
              width: 10, height: 10,
              background: "#1C1A13",
              transform: "rotate(45deg)",
            }} />
            {message}
          </div>
        </>
      )}
    </span>
  );
}