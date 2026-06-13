export default function EmptyMyDrinks({ onCreateClick, t }) {
  return (
    <div style={{
      border: `2px dashed ${t.border}`,
      borderRadius: 14,
      padding: 16,
      textAlign: "center",
      margin: "12px 0 4px",
      cursor: "pointer",
    }} onClick={onCreateClick}>
      <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 300, lineHeight: 1.5 }}>
        Coffee recipes you save in your journal will appear here.
      </div>
      <div style={{
        marginTop: 6,
        fontSize: 11, color: t.accent, fontWeight: 500,
      }}>
        + Add to journal
      </div>
    </div>
  );
}