import { useState } from "react";
import NavBar from "../components/NavBar";
import { useJournal } from "../context/JournalContext";
import { TrashIcon, PlusIcon } from "../components/Icons";

export default function GrindersScreen({ navigate, s, t }) {
  const { grinders, addGrinder, updateGrinder, deleteGrinder } = useJournal();
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDefault, setNewDefault] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await addGrinder(newName.trim(), newDefault || grinders.length === 0);
    setNewName("");
    setNewDefault(false);
    setShowForm(false);
  };

  const handleSetDefault = async (id) => {
    await updateGrinder(id, { is_default: true });
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    await deleteGrinder(confirmDelete.id);
    setConfirmDelete(null);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ ...s.header, display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span onClick={() => navigate("Profile")} style={{ fontSize: 18, color: t.accent, cursor: "pointer" }}>←</span>
            <span onClick={() => navigate("Profile")} style={{ fontSize: 12, color: t.textMuted, cursor: "pointer" }}>Profile</span>
          </div>
          <div style={s.pageTitle}>Grinders</div>
          <div style={s.pageSub}>Save your grinders for quicker journaling.</div>
        </div>
        <div
          onClick={() => setShowForm(true)}
          style={{
            width: 36, height: 36, borderRadius: "50%", background: t.accent,
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", marginTop: 4,
          }}
        >
          <PlusIcon size={18} color="#fff" />
        </div>
      </div>

      <div style={{ padding: "20px 26px 0" }}>

        {grinders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: t.textMuted, fontSize: 13, fontWeight: 300 }}>
            No grinders saved yet. Tap + to add your first one.
          </div>
        ) : (
          grinders.map(g => (
            <div key={g.id} style={{
              background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 14,
              padding: 14, marginBottom: 10,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: t.text, fontWeight: 500, marginBottom: 2 }}>{g.name}</div>
                {g.is_default ? (
                  <div style={{ fontSize: 10, color: t.accent, letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 500 }}>Default</div>
                ) : (
                  <div
                    onClick={() => handleSetDefault(g.id)}
                    style={{ fontSize: 10, color: t.textMuted, letterSpacing: 0.5, textTransform: "uppercase", cursor: "pointer" }}
                  >
                    Set as default
                  </div>
                )}
              </div>
              <div
                onClick={() => setConfirmDelete(g)}
                style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <TrashIcon color={t.textMuted} />
              </div>
            </div>
          ))
        )}

      </div>

      {/* Add grinder form */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} style={{ position: "fixed", inset: 0, background: "rgba(28,26,19,0.55)", zIndex: 200 }} />
          <div style={{
            position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: "100%", maxWidth: 430,
            background: t.bg, borderRadius: "24px 24px 0 0",
            padding: "14px 22px 28px", zIndex: 201,
          }}>
            <div style={{ width: 40, height: 4, background: t.border, borderRadius: 2, margin: "0 auto 18px" }} />
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 20, fontStyle: "italic", textAlign: "center", color: t.text, marginBottom: 20 }}>
              Add Grinder
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: t.accent, letterSpacing: 1, textTransform: "uppercase", fontWeight: 500, marginBottom: 6 }}>
                Name
              </div>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Niche Zero, Baratza Encore"
                style={{
                  width: "100%", padding: "12px 14px",
                  background: "transparent", border: `1px solid ${t.border}`, borderRadius: 12,
                  fontFamily: "'Outfit', sans-serif", fontSize: 13, color: t.text, outline: "none",
                }}
              />
            </div>

            <div
              onClick={() => setNewDefault(!newDefault)}
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, cursor: "pointer" }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                border: `2px solid ${newDefault ? t.accent : t.border}`,
                background: newDefault ? t.accent : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: "#fff", fontWeight: 700,
              }}>
                {newDefault && "✓"}
              </div>
              <span style={{ fontSize: 13, color: t.text }}>Set as default grinder</span>
            </div>

            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              style={{
                width: "100%", padding: 14,
                background: t.accent, color: "#fff", border: "none", borderRadius: 12,
                fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500,
                cursor: newName.trim() ? "pointer" : "not-allowed", opacity: newName.trim() ? 1 : 0.5,
                marginBottom: 8,
              }}
            >
              Add Grinder
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                width: "100%", padding: 14,
                background: "transparent", border: `1px solid ${t.border}`, borderRadius: 12,
                fontFamily: "'Outfit', sans-serif", fontSize: 13, color: t.textMuted, cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <>
          <div onClick={() => setConfirmDelete(null)} style={{ position: "fixed", inset: 0, background: "rgba(28,26,19,0.55)", zIndex: 200 }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "calc(100% - 40px)", maxWidth: 320,
            background: t.bg, border: `1px solid ${t.border}`, borderRadius: 16,
            padding: 22, zIndex: 201,
          }}>
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontStyle: "italic", color: t.text, marginBottom: 8 }}>
              Delete grinder?
            </div>
            <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 300, marginBottom: 18, lineHeight: 1.5 }}>
              "{confirmDelete.name}" will be removed. Existing journal entries will keep their grinder data.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{ flex: 1, padding: 12, background: "transparent", border: `1px solid ${t.border}`, borderRadius: 10, fontFamily: "'Outfit', sans-serif", fontSize: 13, color: t.text, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{ flex: 1, padding: 12, background: "#E24B4A", border: "none", borderRadius: 10, fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#fff", fontWeight: 500, cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}

      <NavBar current="Profile" navigate={navigate} s={s} t={t} />
    </div>
  );
}