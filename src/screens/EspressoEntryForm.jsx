import { useState } from "react";
import NavBar from "../components/NavBar";
import { useJournal } from "../context/JournalContext";
import InfoIcon from "../components/InfoIcon";

const ROAST_LEVELS = [
  { id: "Light", label: "Light" },
  { id: "Lt-Med", label: "Lt-Med" },
  { id: "Medium", label: "Medium" },
  { id: "Md-Dk", label: "Md-Dk" },
  { id: "Dark", label: "Dark" },
];

export default function EspressoEntryForm({ navigate, s, t, units, item }) {
  const { addEspresso, updateEspresso, grinders, defaultGrinder } = useJournal();
  const editing = !!item;

  const [beanName, setBeanName] = useState(item?.bean_name || "");
  const [roastDate, setRoastDate] = useState(item?.roast_date || "");
  const [roastLevel, setRoastLevel] = useState(item?.roast_level || "");
  const [grinderId, setGrinderId] = useState(item?.grinder_id || defaultGrinder?.id || "");
  const [showRpm, setShowRpm] = useState(!!item?.grinder_rpm);
  const [grinderSetting, setGrinderSetting] = useState(item?.grinder_setting || "");
  const [grinderRpm, setGrinderRpm] = useState(item?.grinder_rpm || "");
  const [dose, setDose] = useState(item?.dose || "");
  const [yieldVal, setYieldVal] = useState(item?.yield || "");
  const [brewTime, setBrewTime] = useState(item?.brew_time || "");
  const [notes, setNotes] = useState(item?.notes || "");
  const [showGrinderPicker, setShowGrinderPicker] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedGrinder = grinders.find(g => g.id === grinderId);
  const ratio = dose && yieldVal ? `1:${(Number(yieldVal) / Number(dose)).toFixed(1)}` : "—";

  const handleSave = async () => {
    if (!beanName.trim()) return setError("Bean name is required.");
    if (!dose) return setError("Dose is required.");
    if (!yieldVal) return setError("Yield is required.");

    setSaving(true);
    setError("");

    const payload = {
      bean_name: beanName.trim(),
      roast_date: roastDate || null,
      roast_level: roastLevel || null,
      grinder_id: grinderId || null,
      grinder_setting: grinderSetting.trim() || null,
      grinder_rpm: showRpm && grinderRpm ? grinderRpm.trim() : null,
      dose: Number(dose),
      yield: Number(yieldVal),
      brew_time: brewTime ? Number(brewTime) : null,
      unit: "g",
      notes: notes.trim() || null,
    };

    const { error: saveError } = editing
      ? await updateEspresso(item.id, payload)
      : await addEspresso(payload);

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
      resize: "none", minHeight: 60, outline: "none",
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
          {editing ? "Edit Shot" : "New Shot"}
        </div>
        <span onClick={handleSave} style={{ fontSize: 13, color: t.accent, fontWeight: 500, cursor: "pointer", opacity: saving ? 0.5 : 1 }}>
          {saving ? "..." : "Save"}
        </span>
      </div>

      <div style={{ padding: "20px 26px 0" }}>

        {/* Bean Name */}
        <div style={styles.field}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Bean Name<span style={styles.req}> *</span></span>
            <InfoIcon t={t} message="The roaster and bean name, e.g. 'Counter Culture Hologram'." />
          </div>
          <input style={styles.input} value={beanName} onChange={e => setBeanName(e.target.value)} />
        </div>

        {/* Roast Date — native date picker */}
        <div style={styles.field}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Roast Date</span>
            <InfoIcon t={t} message="When the beans were roasted. Helps you track freshness over time." />
          </div>
          <input
            type="date"
            style={styles.input}
            value={roastDate}
            onChange={e => setRoastDate(e.target.value)}
          />
        </div>

        {/* Roast Level slider */}
        <div style={styles.field}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Roast Level</span>
          </div>
          <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, padding: 12, background: "transparent" }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
              {ROAST_LEVELS.map(level => (
                <div
                  key={level.id}
                  onClick={() => setRoastLevel(level.id)}
                  style={{
                    flex: 1, height: 28, borderRadius: 8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, letterSpacing: 0.5, textTransform: "uppercase",
                    color: roastLevel === level.id ? "#fff" : t.textMuted,
                    background: roastLevel === level.id ? t.accent : t.bg3,
                    fontWeight: roastLevel === level.id ? 500 : 400,
                    cursor: "pointer",
                  }}
                >
                  {level.label}
                </div>
              ))}
            </div>
            {roastLevel && (
              <div style={{ textAlign: "center", fontSize: 11, color: t.accent, fontWeight: 500 }}>
                {ROAST_LEVELS.find(l => l.id === roastLevel)?.label === "Lt-Med" ? "Light Medium" :
                 ROAST_LEVELS.find(l => l.id === roastLevel)?.label === "Md-Dk" ? "Medium Dark" :
                 roastLevel}
              </div>
            )}
          </div>
        </div>

        {/* Grinder */}
        <div style={styles.field}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Grinder</span>
            <InfoIcon t={t} message="Choose from your saved grinders. Manage them in Profile settings." />
          </div>
          <div style={styles.dropdown} onClick={() => setShowGrinderPicker(true)}>
            <div>
              {selectedGrinder ? (
                <>
                  <span style={{ color: t.text }}>{selectedGrinder.name}</span>
                  {selectedGrinder.is_default && (
                    <span style={{ fontSize: 9, color: t.textMuted, letterSpacing: 0.5, textTransform: "uppercase", marginLeft: 6 }}>
                      Default
                    </span>
                  )}
                </>
              ) : (
                <span style={{ color: t.textDim }}>{grinders.length === 0 ? "Add one in Settings" : "Select"}</span>
              )}
            </div>
            <span style={{ color: t.accent }}>›</span>
          </div>
        </div>

        {/* Grinder setting + RPM */}
        <div style={{ ...styles.field, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div style={styles.labelRow}>
              <span style={styles.label}>Setting</span>
            </div>
            <input style={styles.input} value={grinderSetting} onChange={e => setGrinderSetting(e.target.value)} />
          </div>
          {showRpm ? (
            <div>
              <div style={styles.labelRow}>
                <span style={styles.label}>RPM</span>
              </div>
              <input style={styles.input} value={grinderRpm} onChange={e => setGrinderRpm(e.target.value)} />
            </div>
          ) : (
            <div>
              <div style={styles.labelRow}>&nbsp;</div>
              <div
                onClick={() => setShowRpm(true)}
                style={{
                  width: "100%", padding: "12px 14px",
                  background: t.bg3, borderRadius: 12,
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 11, color: t.textMuted, cursor: "pointer",
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: "50%",
                  background: t.accent, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12,
                }}>+</div>
                Add RPM
              </div>
            </div>
          )}
        </div>

        {/* Dose / Yield / Time */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div>
            <div style={styles.labelRow}>
              <span style={styles.label}>Dose<span style={styles.req}> *</span></span>
            </div>
            <input type="number" style={styles.input} value={dose} onChange={e => setDose(e.target.value)} placeholder="g" />
          </div>
          <div>
            <div style={styles.labelRow}>
              <span style={styles.label}>Yield<span style={styles.req}> *</span></span>
            </div>
            <input type="number" style={styles.input} value={yieldVal} onChange={e => setYieldVal(e.target.value)} placeholder="g" />
          </div>
          <div>
            <div style={styles.labelRow}>
              <span style={styles.label}>Time</span>
            </div>
            <input type="number" style={styles.input} value={brewTime} onChange={e => setBrewTime(e.target.value)} placeholder="s" />
          </div>
        </div>

        {/* Calculated ratio */}
        <div style={{
          border: `1px dashed ${t.accent}`, borderRadius: 10,
          padding: "10px 14px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 14, background: "transparent",
        }}>
          <span style={{ fontSize: 10, color: t.textMuted, letterSpacing: 0.5, textTransform: "uppercase" }}>Ratio</span>
          <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontStyle: "italic", color: t.accent }}>{ratio}</span>
        </div>

        {/* Notes */}
        <div style={styles.field}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Notes</span>
            <InfoIcon t={t} message="Tasting notes, what to adjust on the next pull." />
          </div>
          <textarea style={styles.textarea} value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        {error && (
          <div style={{ fontSize: 12, color: "#E24B4A", marginBottom: 12, textAlign: "center" }}>{error}</div>
        )}

      </div>

      {/* Grinder picker */}
      {showGrinderPicker && (
        <>
          <div onClick={() => setShowGrinderPicker(false)} style={{ position: "fixed", inset: 0, background: "rgba(28,26,19,0.55)", zIndex: 200 }} />
          <div style={{
            position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: "100%", maxWidth: 430,
            background: t.bg, borderRadius: "24px 24px 0 0",
            padding: "14px 22px 28px", zIndex: 201,
          }}>
            <div style={{ width: 40, height: 4, background: t.border, borderRadius: 2, margin: "0 auto 18px" }} />
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontStyle: "italic", textAlign: "center", color: t.text, marginBottom: 14 }}>
              Select Grinder
            </div>
            {grinders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: t.textMuted, fontSize: 13, fontWeight: 300, marginBottom: 12 }}>
                You haven't added any grinders yet. Manage them in Profile settings.
              </div>
            ) : (
              grinders.map(g => (
                <div
                  key={g.id}
                  onClick={() => { setGrinderId(g.id); setShowGrinderPicker(false); }}
                  style={{
                    padding: "14px 16px",
                    background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 12,
                    marginBottom: 6, cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    fontSize: 14, color: grinderId === g.id ? t.accent : t.text,
                    fontWeight: grinderId === g.id ? 500 : 400,
                  }}
                >
                  <div>
                    {g.name}
                    {g.is_default && (
                      <span style={{ fontSize: 9, color: t.textMuted, letterSpacing: 0.5, textTransform: "uppercase", marginLeft: 6 }}>
                        Default
                      </span>
                    )}
                  </div>
                  {grinderId === g.id && <span>✓</span>}
                </div>
              ))
            )}
          </div>
        </>
      )}

      <NavBar current="Journal" navigate={navigate} s={s} t={t} />
    </div>
  );
}