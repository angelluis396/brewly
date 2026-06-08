import { useState } from "react";
import InfoIcon from "../components/InfoIcon";
import { useJournal } from "../context/JournalContext";

const COFFEE_OPTIONS = [
  { id: "espresso", name: "Espresso", hasSubToggle: true, subOptions: ["Single Shot", "Double Shot"] },
  { id: "cold-brew", name: "Cold Brew" },
  { id: "pour-over", name: "Pour Over" },
  { id: "drip-coffee", name: "Drip Coffee" },
  { id: "instant-coffee", name: "Instant Coffee" },
  { id: "other", name: "Other", needsText: true },
];

const MILK_OPTIONS = [
  { id: "cows-milk", name: "Cow's Milk", hasSubToggle: true, subOptions: ["Whole", "2%", "1%", "Skim"] },
  { id: "almond", name: "Almond Milk" },
  { id: "oat", name: "Oat Milk" },
  { id: "soy", name: "Soy Milk" },
  { id: "other", name: "Other", needsText: true },
];

function parseCoffeeUsed(value) {
  if (!value) return { coffeeId: null, subOption: null, otherText: "" };
  for (const opt of COFFEE_OPTIONS) {
    if (opt.hasSubToggle) {
      for (const sub of opt.subOptions) {
        if (value === `${opt.name} · ${sub}`) return { coffeeId: opt.id, subOption: sub, otherText: "" };
      }
    } else if (opt.name === value) {
      return { coffeeId: opt.id, subOption: null, otherText: "" };
    }
  }
  return { coffeeId: "other", subOption: null, otherText: value };
}

function parseMilkType(value) {
  if (!value) return { milkId: null, subOption: null, otherText: "" };
  for (const opt of MILK_OPTIONS) {
    if (opt.hasSubToggle) {
      for (const sub of opt.subOptions) {
        if (value === `${opt.name} · ${sub}`) return { milkId: opt.id, subOption: sub, otherText: "" };
      }
    } else if (opt.name === value) {
      return { milkId: opt.id, subOption: null, otherText: "" };
    }
  }
  return { milkId: "other", subOption: null, otherText: value };
}

function buildCoffeeUsedValue(coffeeId, subOption, otherText) {
  const opt = COFFEE_OPTIONS.find(o => o.id === coffeeId);
  if (!opt) return "";
  if (opt.needsText) return otherText.trim();
  if (opt.hasSubToggle && subOption) return `${opt.name} · ${subOption}`;
  return opt.name;
}

function buildMilkTypeValue(milkId, subOption, otherText) {
  const opt = MILK_OPTIONS.find(o => o.id === milkId);
  if (!opt) return "";
  if (opt.needsText) return otherText.trim();
  if (opt.hasSubToggle && subOption) return `${opt.name} · ${subOption}`;
  return opt.name;
}

export default function DrinkEntryForm({ navigate, s, t, units, item }) {
  const { addDrink, updateDrink } = useJournal();
  const editing = !!item;

  const initialCoffee = parseCoffeeUsed(item?.coffee_used);
  const initialMilk = parseMilkType(item?.milk_type);

  const [name, setName] = useState(item?.name || "");
  const [coffeeId, setCoffeeId] = useState(initialCoffee.coffeeId);
  const [coffeeSubOption, setCoffeeSubOption] = useState(initialCoffee.subOption);
  const [coffeeOtherText, setCoffeeOtherText] = useState(initialCoffee.otherText);
  const [hasMilk, setHasMilk] = useState(item?.milk_type ? true : false);
  const [milkId, setMilkId] = useState(initialMilk.milkId);
  const [milkSubOption, setMilkSubOption] = useState(initialMilk.subOption);
  const [milkOtherText, setMilkOtherText] = useState(initialMilk.otherText);
  const [milkAmount, setMilkAmount] = useState(item?.milk_amount || "");
  const [method, setMethod] = useState(item?.method || "");
  const [notes, setNotes] = useState(item?.notes || "");

  const [showCoffeePicker, setShowCoffeePicker] = useState(false);
  const [showMilkPicker, setShowMilkPicker] = useState(false);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedCoffee = COFFEE_OPTIONS.find(o => o.id === coffeeId);
  const selectedMilk = MILK_OPTIONS.find(o => o.id === milkId);

  const handleSave = async () => {
    if (!name.trim()) return setError("Recipe name is required.");
    const coffeeUsed = buildCoffeeUsedValue(coffeeId, coffeeSubOption, coffeeOtherText);
    if (!coffeeUsed) return setError("Coffee used is required.");
    if (!method.trim()) return setError("Method / prep steps are required.");

    setSaving(true);
    setError("");

    const milkValue = hasMilk ? buildMilkTypeValue(milkId, milkSubOption, milkOtherText) : null;

    const payload = {
      name: name.trim(),
      coffee_used: coffeeUsed,
      milk_type: milkValue,
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
      fontFamily: "'Outfit', sans-serif", fontSize: 13, color: t.text, outline: "none",
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

  const renderCoffeeDisplay = () => {
    if (!selectedCoffee) return <span style={{ color: t.textDim }}>Select</span>;
    if (selectedCoffee.needsText) return <span style={{ color: t.text }}>{coffeeOtherText || "Other"}</span>;
    if (selectedCoffee.hasSubToggle && coffeeSubOption) return <span style={{ color: t.text }}>{selectedCoffee.name} · {coffeeSubOption}</span>;
    return <span style={{ color: t.text }}>{selectedCoffee.name}</span>;
  };

  const renderMilkDisplay = () => {
    if (!selectedMilk) return <span style={{ color: t.textDim }}>Select</span>;
    if (selectedMilk.needsText) return <span style={{ color: t.text }}>{milkOtherText || "Other"}</span>;
    if (selectedMilk.hasSubToggle && milkSubOption) return <span style={{ color: t.text }}>{selectedMilk.name} · {milkSubOption}</span>;
    return <span style={{ color: t.text }}>{selectedMilk.name}</span>;
  };

  return (
    <div>
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

        <div style={styles.field}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Recipe Name<span style={styles.req}> *</span></span>
            <InfoIcon t={t} message="The name of your drink, e.g. 'Iced Oat Latte' or 'Saturday Pour Over'." />
          </div>
          <input style={styles.input} value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div style={styles.field}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Coffee Used<span style={styles.req}> *</span></span>
            <InfoIcon t={t} message="What type of coffee did you use as the base?" />
          </div>
          <div style={styles.dropdown} onClick={() => setShowCoffeePicker(true)}>
            {renderCoffeeDisplay()}
            <span style={{ color: t.accent }}>›</span>
          </div>
          {selectedCoffee?.needsText && (
            <input
              style={{ ...styles.input, marginTop: 8 }}
              value={coffeeOtherText}
              onChange={e => setCoffeeOtherText(e.target.value)}
              placeholder="Specify other coffee"
            />
          )}
        </div>

        <div style={styles.field}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Milk?</span>
          </div>
          <div style={{ display: "flex", border: `1px solid ${t.border}`, borderRadius: 12, padding: 4, gap: 4 }}>
            <div onClick={() => setHasMilk(true)} style={{ flex: 1, padding: "8px 0", textAlign: "center", borderRadius: 8, fontSize: 12, fontWeight: hasMilk ? 500 : 400, background: hasMilk ? t.accent : "transparent", color: hasMilk ? "#fff" : t.textMuted, cursor: "pointer" }}>Yes</div>
            <div onClick={() => { setHasMilk(false); setMilkId(null); setMilkSubOption(null); setMilkOtherText(""); setMilkAmount(""); }} style={{ flex: 1, padding: "8px 0", textAlign: "center", borderRadius: 8, fontSize: 12, fontWeight: !hasMilk ? 500 : 400, background: !hasMilk ? t.accent : "transparent", color: !hasMilk ? "#fff" : t.textMuted, cursor: "pointer" }}>No</div>
          </div>
        </div>

        {hasMilk && (
          <div style={{ paddingLeft: 14, borderLeft: `2px solid ${t.accent}`, marginBottom: 14 }}>
            <div style={{ marginBottom: 10 }}>
              <div style={styles.labelRow}>
                <span style={styles.label}>Type</span>
              </div>
              <div style={styles.dropdown} onClick={() => setShowMilkPicker(true)}>
                {renderMilkDisplay()}
                <span style={{ color: t.accent }}>›</span>
              </div>
              {selectedMilk?.needsText && (
                <input style={{ ...styles.input, marginTop: 8 }} value={milkOtherText} onChange={e => setMilkOtherText(e.target.value)} placeholder="Specify other milk" />
              )}
            </div>
            <div>
              <div style={styles.labelRow}>
                <span style={styles.label}>Amount ({units})</span>
              </div>
              <input type="number" style={styles.input} value={milkAmount} onChange={e => setMilkAmount(e.target.value)} />
            </div>
          </div>
        )}

        <div style={styles.field}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Method / Prep Steps<span style={styles.req}> *</span></span>
            <InfoIcon t={t} message="How did you make it? Step by step or freeform notes." />
          </div>
          <textarea style={styles.textarea} value={method} onChange={e => setMethod(e.target.value)} />
        </div>

        <div style={styles.field}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Notes</span>
            <InfoIcon t={t} message="Tasting notes, tweaks, what to try next time." />
          </div>
          <textarea style={styles.textarea} value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        {error && <div style={{ fontSize: 12, color: "#E24B4A", marginBottom: 12, textAlign: "center" }}>{error}</div>}
      </div>

      {/* Coffee picker */}
      {showCoffeePicker && (
        <>
          <div onClick={() => setShowCoffeePicker(false)} style={{ position: "fixed", inset: 0, background: "rgba(28,26,19,0.55)", zIndex: 200 }} />
          <div style={{
            position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: "100%", maxWidth: 430,
            background: t.bg, borderRadius: "24px 24px 0 0",
            padding: "14px 22px 28px", zIndex: 201,
            maxHeight: "80vh", overflowY: "auto",
          }}>
            <div style={{ width: 40, height: 4, background: t.border, borderRadius: 2, margin: "0 auto 18px" }} />
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontStyle: "italic", textAlign: "center", color: t.text, marginBottom: 14 }}>
              Select Coffee
            </div>
            {COFFEE_OPTIONS.map(opt => {
              const isSelected = coffeeId === opt.id;
              if (opt.hasSubToggle && isSelected) {
                return (
                  <div key={opt.id} style={{ padding: "14px 16px", background: t.bg2, border: `1px solid ${t.accent}`, borderRadius: 12, marginBottom: 6 }}>
                    <div style={{ fontSize: 13, color: t.accent, fontWeight: 500, marginBottom: 10 }}>{opt.name}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {opt.subOptions.map(sub => (
                        <div key={sub} onClick={() => { setCoffeeSubOption(sub); setShowCoffeePicker(false); }} style={{ flex: 1, padding: "10px 0", textAlign: "center", borderRadius: 8, fontSize: 11, background: coffeeSubOption === sub ? t.accent : t.bg3, color: coffeeSubOption === sub ? "#fff" : t.textMuted, fontWeight: coffeeSubOption === sub ? 500 : 400, cursor: "pointer" }}>
                          {sub}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <div key={opt.id} onClick={() => {
                  setCoffeeId(opt.id);
                  if (!opt.hasSubToggle) {
                    setCoffeeSubOption(null);
                    setShowCoffeePicker(false);
                  } else if (!coffeeSubOption) {
                    setCoffeeSubOption(opt.subOptions[0]);
                  }
                }} style={{ padding: "14px 16px", background: t.bg2, border: `1px solid ${isSelected ? t.accent : t.border}`, borderRadius: 12, marginBottom: 6, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: isSelected ? t.accent : t.text, fontWeight: isSelected ? 500 : 400 }}>
                  {opt.name}
                  {isSelected && <span>✓</span>}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Milk picker */}
      {showMilkPicker && (
        <>
          <div onClick={() => setShowMilkPicker(false)} style={{ position: "fixed", inset: 0, background: "rgba(28,26,19,0.55)", zIndex: 200 }} />
          <div style={{
            position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: "100%", maxWidth: 430,
            background: t.bg, borderRadius: "24px 24px 0 0",
            padding: "14px 22px 28px", zIndex: 201,
            maxHeight: "80vh", overflowY: "auto",
          }}>
            <div style={{ width: 40, height: 4, background: t.border, borderRadius: 2, margin: "0 auto 18px" }} />
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontStyle: "italic", textAlign: "center", color: t.text, marginBottom: 14 }}>
              Select Milk Type
            </div>
            {MILK_OPTIONS.map(opt => {
              const isSelected = milkId === opt.id;
              if (opt.hasSubToggle && isSelected) {
                return (
                  <div key={opt.id} style={{ padding: "14px 16px", background: t.bg2, border: `1px solid ${t.accent}`, borderRadius: 12, marginBottom: 6 }}>
                    <div style={{ fontSize: 13, color: t.accent, fontWeight: 500, marginBottom: 10 }}>{opt.name}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      {opt.subOptions.map(sub => (
                        <div key={sub} onClick={() => { setMilkSubOption(sub); setShowMilkPicker(false); }} style={{ padding: "10px 0", textAlign: "center", borderRadius: 8, fontSize: 11, background: milkSubOption === sub ? t.accent : t.bg3, color: milkSubOption === sub ? "#fff" : t.textMuted, fontWeight: milkSubOption === sub ? 500 : 400, cursor: "pointer" }}>
                          {sub}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <div key={opt.id} onClick={() => {
                  setMilkId(opt.id);
                  if (!opt.hasSubToggle) {
                    setMilkSubOption(null);
                    setShowMilkPicker(false);
                  } else if (!milkSubOption) {
                    setMilkSubOption(opt.subOptions[0]);
                  }
                }} style={{ padding: "14px 16px", background: t.bg2, border: `1px solid ${isSelected ? t.accent : t.border}`, borderRadius: 12, marginBottom: 6, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: isSelected ? t.accent : t.text, fontWeight: isSelected ? 500 : 400 }}>
                  {opt.name}
                  {isSelected && <span>✓</span>}
                </div>
              );
            })}
          </div>
        </>
      )}

    </div>
  );
}