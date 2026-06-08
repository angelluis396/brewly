import { useState } from "react";
import NavBar from "../components/NavBar";
import { useJournal } from "../context/JournalContext";
import { EditIcon, TrashIcon } from "../components/Icons";

const ROAST_LEVELS = ["Light", "Lt-Med", "Medium", "Md-Dk", "Dark"];

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

function formatRoastDate(d) {
  if (!d) return null;
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function roastDisplayName(level) {
  if (level === "Lt-Med") return "Light Medium";
  if (level === "Md-Dk") return "Medium Dark";
  return level;
}

export default function EspressoEntryDetailScreen({ item, navigate, s, t }) {
  const { deleteEspresso, grinders } = useJournal();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!item) {
    navigate("Journal");
    return null;
  }

  const grinder = grinders.find(g => g.id === item.grinder_id);
  const ratio = item.dose && item.yield ? `1:${(Number(item.yield) / Number(item.dose)).toFixed(1)}` : "—";
  const roastIdx = ROAST_LEVELS.indexOf(item.roast_level);
  const roastDate = formatRoastDate(item.roast_date);

  const handleDelete = async () => {
    await deleteEspresso(item.id);
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
              Espresso Shot
            </div>
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 26, fontStyle: "italic", color: t.text, lineHeight: 1.2, marginBottom: 6 }}>
              {item.bean_name}
            </div>
            <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 300 }}>
              {formatDate(item.created_at)}
              {roastDate && ` · Roasted ${roastDate}`}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 26px 0" }}>

        {/* Roast level */}
        {item.roast_level && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: t.accent, letterSpacing: 1, textTransform: "uppercase", fontWeight: 500, marginBottom: 8 }}>
              Roast Level
            </div>
            <div style={{ background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {ROAST_LEVELS.map((_, i) => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: i === roastIdx ? t.accent : t.border,
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 13, color: t.accent, fontWeight: 500 }}>
                  {roastDisplayName(item.roast_level)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Stat strip */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
          background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 12,
          marginBottom: 16, overflow: "hidden",
        }}>
          {[
            [`${item.dose}${item.unit || "g"}`, "Dose"],
            [`${item.yield}${item.unit || "g"}`, "Yield"],
            [item.brew_time ? `${item.brew_time}s` : "—", "Time"],
            [ratio, "Ratio"],
          ].map(([val, label], i, arr) => (
            <div key={label} style={{
              padding: "12px 0", textAlign: "center",
              borderRight: i < arr.length - 1 ? `1px solid ${t.border}` : "none",
            }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: t.text }}>{val}</div>
              <div style={{ fontSize: 9, color: t.textMuted, letterSpacing: 0.5, textTransform: "uppercase", marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Grinder */}
        {(grinder || item.grinder_setting) && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: t.accent, letterSpacing: 1, textTransform: "uppercase", fontWeight: 500, marginBottom: 6 }}>
              Grinder
            </div>
            <div style={{ background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 14px", fontSize: 13, color: t.text }}>
              {grinder?.name || "—"}
              {item.grinder_setting && (
                <div style={{ marginTop: 6, fontSize: 12, color: t.textMuted }}>
                  Setting: <span style={{ color: t.text }}>{item.grinder_setting}</span>
                  {item.grinder_rpm && <> · RPM: <span style={{ color: t.text }}>{item.grinder_rpm}</span></>}
                </div>
              )}
            </div>
          </div>
        )}

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

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button
            onClick={() => navigate("EspressoEntryForm", item)}
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

      {/* Delete modal */}
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
              Delete shot?
            </div>
            <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 300, marginBottom: 18, lineHeight: 1.5 }}>
              "{item.bean_name}" will be permanently removed.
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

      <NavBar current="Journal" navigate={navigate} s={s} t={t} />
    </div>
  );
}