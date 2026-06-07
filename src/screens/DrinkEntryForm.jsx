import { useState } from "react";
import NavBar from "../components/NavBar";
import InfoIcon from "../components/InfoIcon";
import { useJournal } from "../context/JournalContext";

const MILK_TYPES = ["Whole", "Oat", "Almond", "Skim", "Soy", "Other"];

export default function DrinkEntryForm({ navigate, s, t, units, item }) {
  const { addDrink, updateDrink } = useJournal();
  const editing = !!item;

  const [name, setName] = useState(item?.name || "");
  const [coffee, setCoffee] = useState(item?.coffee_used || "");
  const [hasMilk, setHasMilk] = useState(item?.milk_type ? true : false);
  const [milkType, setMilkType] = useState(item?.milk_type || "");
  const [milkAmount, setMilkAmount] = useState(item?.milk_amount || "");
  const [method, setMethod] = useState(item?.method || "");
  const [notes, setNotes] = useState(item?.notes || "");
  const [showMilkPicker, setShowMilkPicker] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return setError("Recipe name is required.");
    if (!coffee.trim()) return setError("Coffee used is required.");
    if (!method.trim()) return setError("Method / prep steps are required.");

    setSaving(true);
    setError("");

    const payload = {
      name: name.trim(),
      coffee_used: coffee.trim(),
      milk_type: hasMilk && milkType ? milkType : null,
      milk_amount: hasMilk && milkAmount ? Number(milkAmount) : null,
      milk_unit: hasMilk ? units : null,
      method: method.trim(),
      notes: notes.trim() || null,
    };

    const { error: saveError } = editing
      ? await updateDrink(item.id, payload)
      : await addDrink(payload);

    if (saveError) {
      setError(saveError.message);
      setSaving(false);
    } else {
      navigate("Journal");
    }
  };

  const styles = {
    input: {
      width: "100%", padding: "12px 14px",
      background: "transparent", border: `1px solid ${t.border}`, borderRadius: 12,
      fontFamily: "'Outfit', sans-serif", fontSize: 13, color: t.text,
      outline: "none",
    },
    textarea: {
      width: "100%", padding: "12px 14px",
      background: "transparent", border: `1px solid ${t.border}`, borderRadius: 12,
      fontFamily: "'Outfit', sans-serif", fontSize: 13, color: t.text,
      resize: "none", minHeight: 70, outline: "none",
    },
    labelRow: { display: "flex", alignItems: "center", gap: 6, marginBottom: 6 },
    label: { fontSize: 10, color: t.accent, letterSpacing: 1, textTransform: "uppercase", fontWeight: 500 },
    req: { color: t.accent },
    field: { marginBottom: 14 },
    dropdown: {
      width: "100%", padding: "12px 14px",
      background: "transparent", border: `1px solid ${t.border}`, borderRadius: 12,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      cursor: "pointer", fontSize: 13,
    },
  };

  return (
    <div>
      {/* Header */}
      <div style={{ ...s.header, display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 20 }}>
        <span onClick={() => navigate("Journal")} style={{ fontSize: 12, color: t.textMuted, cursor: "pointer" }}>← Cancel</span>
        <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 20, fontStyle: "italic", color: t.text }}>
          {editing ? "Edit Entry" : "New Entry"}
        </div>
        <span onClick={handleSave} style={{ fontSize: 13, color: t.accent, fontWeight: 500, cursor: "pointer", opacity: saving ? 0.5 : 1 }}>
          {saving ? "..." : "Save"}
        </span>
      </div>

      <div style={{ padding: "20px 26px 0" }}>

        {/* Name */}
        <div style={styles.field}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Recipe Name<span style={styles.req}> *</span></span>
            <InfoIcon t={t} message="The name of your drink, e.g. 'Iced Oat Latte' or 'Saturday Pour Over'." />
          </div>
          <input style={styles.input} value={name} onChange={e => setName(e.target.value)} />
        </div>

        {/* Coffee */}
        <div style={styles.field}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Coffee Used<span style={styles.req}> *</span></span>
            <InfoIcon t={t} message="What kind of coffee and how much, e.g. '2 shots espresso' or '20g pour over'." />
          </div>
          <input style={styles.input} value={coffee} onChange={e => setCoffee(e.target.value)} />
        </div>

        {/* Milk yes/no */}
        <div style={styles.field}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Milk?</span>
          </div>
          <div style={{ display: "flex", border: `1px solid ${t.border}`, borderRadius: 12, padding: 4, gap: 4 }}>
            <div
              onClick={() => setHasMilk(true)}
              style={{
                flex: 1, padding: "8px 0", textAlign: "center", borderRadius: 8,
                fontSize: 12, fontWeight: hasMilk ? 500 : 400,
                background: hasMilk ? t.accent : "transparent",
                color: hasMilk ? "#fff" : t.textMuted,
                cursor: "pointer",
              }}
            >Yes</div>
            <div
              onClick={() => { setHasMilk(false); setMilkType(""); setMilkAmount(""); }}
              style={{
                flex: 1, padding: "8px 0", textAlign: "center", borderRadius: 8,
                fontSize: 12, fontWeight: !hasMilk ? 500 : 400,
                background: !hasMilk ? t.accent : "transparent",
                color: !hasMilk ? "#fff" : t.textMuted,
                cursor: "pointer",
              }}
            >No</div>
          </div>
        </div>

        {/* Milk details (only if yes) */}
        {hasMilk && (
          <div style={{ paddingLeft: 14, borderLeft: `2px solid ${t.accent}`, marginBottom: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={styles.labelRow}>
                  <span style={styles.label}>Type</span>
                </div>
                <div style={styles.dropdown} onClick={() => setShowMilkPicker(true)}>
                  <span style={{ color: milkType ? t.text : t.textDim }}>{milkType || "Select"}</span>
                  <span style={{ color: t.accent }}>›</span>
                </div>
              </div>
              <div>
                <div style={styles.labelRow}>
                  <span style={styles.label}>Amount ({units})</span>
                </div>
                <input
                  type="number"
                  style={styles.input}
                  value={milkAmount}
                  onChange={e => setMilkAmount(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Method */}
        <div style={styles.field}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Method / Prep Steps<span style={styles.req}> *</span></span>
            <InfoIcon t={t} message="How did you make it? Step by step or freeform notes." />
          </div>
          <textarea style={styles.textarea} value={method} onChange={e => setMethod(e.target.value)} />
        </div>

        {/* Notes */}
        <div style={styles.field}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Notes</span>
            <InfoIcon t={t} message="Tasting notes, tweaks, what to try next time." />
          </div>
          <textarea style={styles.textarea} value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        {error && (
          <div style={{ fontSize: 12, color: "#E24B4A", marginBottom: 12, textAlign: "center" }}>{error}</div>
        )}

      </div>

      {/* Milk type picker */}
      {showMilkPicker && (
        <>
          <div onClick={() => setShowMilkPicker(false)} style={{ position: "fixed", inset: 0, background: "rgba(28,26,19,0.55)", zIndex: 200 }} />
          <div style={{
            position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: "100%", maxWidth: 430,
            background: t.bg, borderRadius: "24px 24px 0 0",
            padding: "14px 22px 28px", zIndex: 201,
          }}>
            <div style={{ width: 40, height: 4, background: t.border, borderRadius: 2, margin: "0 auto 18px" }} />
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontStyle: "italic", textAlign: "center", color: t.text, marginBottom: 14 }}>
              Select Milk Type
            </div>
            {MILK_TYPES.map(type => (
              <div
                key={type}
                onClick={() => { setMilkType(type); setShowMilkPicker(false); }}
                style={{
                  padding: "14px 16px",
                  background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 12,
                  marginBottom: 6, cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  fontSize: 14, color: milkType === type ? t.accent : t.text,
                  fontWeight: milkType === type ? 500 : 400,
                }}
              >
                {type}
                {milkType === type && <span>✓</span>}
              </div>
            ))}
          </div>
        </>
      )}

      <NavBar current="Journal" navigate={navigate} s={s} t={t} />
    </div>
  );
}