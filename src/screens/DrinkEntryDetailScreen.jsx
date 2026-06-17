import { useState } from "react";
import { useJournal } from "../context/JournalContext";
import { EditIcon, TrashIcon } from "../components/Icons";

function formatDate(dateString) {
  const d = new Date(dateString);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (isToday) return `Today · ${time}`;
  if (isYesterday) return `Yesterday · ${time}`;
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · ${time}`;
}

export default function DrinkEntryDetailScreen({ item, navigate, s, t, favorites, setFavorites }) {
  const { deleteDrink } = useJournal();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!item) {
    navigate("Journal");
    return null;
  }

  const favoriteKey = `custom:${item.id}`;
  const isFav = favorites?.includes(favoriteKey);

  const toggleFavorite = () => {
    setFavorites(prev =>
      prev.includes(favoriteKey)
        ? prev.filter(f => f !== favoriteKey)
        : [...prev, favoriteKey]
    );
  };

  const handleDelete = async () => {
    // Also remove from favorites if it was favorited
    if (isFav) {
      setFavorites(prev => prev.filter(f => f !== favoriteKey));
    }
    await deleteDrink(item.id);
    setConfirmDelete(false);
    navigate("Journal");
  };

  return (
    <div>
      {/* Header */}
      <div style={{ ...s.header, paddingBottom: 20 }}>
        <div style={s.backRow}>
          <span style={s.backArrow} onClick={() => navigate("Journal")}>←</span>
          <span style={s.backLabel} onClick={() => navigate("Journal")}>Journal</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: t.accent, marginBottom: 4 }}>
              Coffee Drink
            </div>
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 26, fontStyle: "italic", color: t.text, lineHeight: 1.2, marginBottom: 6 }}>
              {item.name}
            </div>
            <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 300 }}>
              {formatDate(item.created_at)}
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: "20px 26px 0" }}>

        {/* Coffee */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: t.accent, letterSpacing: 1, textTransform: "uppercase", fontWeight: 500, marginBottom: 6 }}>
            Coffee Used
          </div>
          <div style={{ background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 14px", fontSize: 13, color: t.text }}>
            {item.coffee_used}
          </div>
        </div>

        {/* Milk */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: t.accent, letterSpacing: 1, textTransform: "uppercase", fontWeight: 500, marginBottom: 6 }}>
            Milk
          </div>
          <div style={{
            background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 12,
            padding: "12px 14px", fontSize: 13,
            color: item.milk_type ? t.text : t.textDim,
            fontStyle: item.milk_type ? "normal" : "italic",
          }}>
            {item.milk_type ? (item.milk_amount ? `${item.milk_amount}${item.milk_unit} ${item.milk_type}` : item.milk_type) : "None"}
          </div>
        </div>

        {/* Method */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: t.accent, letterSpacing: 1, textTransform: "uppercase", fontWeight: 500, marginBottom: 6 }}>
            Method / Prep Steps
          </div>
          <div style={{ background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 14px", fontSize: 13, color: t.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {item.method}
          </div>
        </div>

        {/* Notes */}
        {item.notes && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: t.accent, letterSpacing: 1, textTransform: "uppercase", fontWeight: 500, marginBottom: 6 }}>
              Notes
            </div>
            <div style={{ background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 14px", fontSize: 13, color: t.text, lineHeight: 1.6, fontStyle: "italic", whiteSpace: "pre-wrap" }}>
              {item.notes}
            </div>
          </div>
        )}

        {/* Favorites toggle */}
        <button
          onClick={toggleFavorite}
          style={{
            width: "100%",
            padding: 14,
            background: isFav ? "transparent" : t.accent,
            color: isFav ? t.accent : "#fff",
            border: isFav ? `1px solid ${t.accent}` : "none",
            borderRadius: 12,
            fontFamily: "'Outfit', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            marginTop: 24,
            marginBottom: 10,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          ♥ {isFav ? "Saved to Favorites" : "Save to Favorites"}
        </button>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => navigate("DrinkEntryForm", item)}
            style={{
              flex: 1, padding: 14,
              background: t.accent, color: "#fff", border: "none", borderRadius: 12,
              fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <EditIcon color="#fff" size={14} />
            Edit
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            style={{
              flex: 1, padding: 14,
              background: "transparent", color: "#E24B4A", border: "1px solid #E24B4A", borderRadius: 12,
              fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <TrashIcon color="#E24B4A" size={14} />
            Delete
          </button>
        </div>

      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <>
          <div onClick={() => setConfirmDelete(false)} style={{ position: "fixed", inset: 0, background: "rgba(28,26,19,0.55)", zIndex: 200 }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "calc(100% - 40px)", maxWidth: 320,
            background: t.bg, border: `1px solid ${t.border}`, borderRadius: 16,
            padding: 22, zIndex: 201,
          }}>
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontStyle: "italic", color: t.text, marginBottom: 8 }}>
              Delete entry?
            </div>
            <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 300, marginBottom: 18, lineHeight: 1.5 }}>
              "{item.name}" will be permanently removed.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setConfirmDelete(false)} style={{ flex: 1, padding: 12, background: "transparent", border: `1px solid ${t.border}`, borderRadius: 10, fontFamily: "'Outfit', sans-serif", fontSize: 13, color: t.text, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleDelete} style={{ flex: 1, padding: 12, background: "#E24B4A", border: "none", borderRadius: 10, fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#fff", fontWeight: 500, cursor: "pointer" }}>
                Delete
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}