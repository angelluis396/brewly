import { useState, useRef, useEffect } from "react";
import InfoIcon from "../components/InfoIcon";
import NumberedTextarea from "../components/NumberedTextarea";
import { useJournal } from "../context/JournalContext";

const ROAST_LEVELS = [
  { id: "Light", label: "Light" },
  { id: "Lt-Med", label: "Light Medium" },
  { id: "Medium", label: "Medium" },
  { id: "Md-Dk", label: "Medium Dark" },
  { id: "Dark", label: "Dark" },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function daysInMonth(month) {
  // month is 0-indexed; use a leap year (2024) for Feb to be safe
  return new Date(2024, month + 1, 0).getDate();
}

export default function EspressoEntryForm({ navigate, s, t, units, item }) {
  const { addEspresso, updateEspresso, grinders, defaultGrinder } = useJournal();
  const editing = !!item;

  const initialRoastDate = item?.roast_date ? new Date(item.roast_date) : null;
  const initialMonth = initialRoastDate ? initialRoastDate.getMonth() : new Date().getMonth();
  const initialDay = initialRoastDate ? initialRoastDate.getDate() : new Date().getDate();

  const [beanName, setBeanName] = useState(item?.bean_name || "");
  const [roastDateUnknown, setRoastDateUnknown] = useState(!item?.roast_date && editing);
  const [roastMonth, setRoastMonth] = useState(initialMonth);
  const [roastDay, setRoastDay] = useState(initialDay);
  const [roastLevel, setRoastLevel] = useState(item?.roast_level || ROAST_LEVELS[2].id);
  const [grinderId, setGrinderId] = useState(item?.grinder_id || defaultGrinder?.id || "");
  const [showRpm, setShowRpm] = useState(!!item?.grinder_rpm);
  const [grinderSetting, setGrinderSetting] = useState(item?.grinder_setting || "");
  const [grinderRpm, setGrinderRpm] = useState(item?.grinder_rpm || "");
  const [dose, setDose] = useState(item?.dose || "");
  const [yieldVal, setYieldVal] = useState(item?.yield || "");
  const [brewTime, setBrewTime] = useState(item?.brew_time || "");
  const [notes, setNotes] = useState(item?.notes || "");
  const [showGrinderPicker, setShowGrinderPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedGrinder = grinders.find(g => g.id === grinderId);
  const ratio = dose && yieldVal ? `1:${(Number(yieldVal) / Number(dose)).toFixed(1)}` : "—";
  const currentLevelIdx = ROAST_LEVELS.findIndex(l => l.id === roastLevel);

  const handleSave = async () => {
    if (!beanName.trim()) return setError("Bean name is required.");
    if (!dose) return setError("Dose is required.");
    if (!yieldVal) return setError("Yield is required.");

    setSaving(true);
    setError("");

    let roastDateValue = null;
    if (!roastDateUnknown) {
      // Use current year, build ISO date
      const year = new Date().getFullYear();
      const monthStr = String(roastMonth + 1).padStart(2, "0");
      const dayStr = String(roastDay).padStart(2, "0");
      roastDateValue = `${year}-${monthStr}-${dayStr}`;
    }

    const payload = {
      bean_name: beanName.trim(),
      roast_date: roastDateValue,
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

  const roastDateDisplay = roastDateUnknown
    ? "Unknown"
    : `${MONTHS[roastMonth]} ${roastDay}`;

  return (
    <div>
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

        {/* Roast Date */}
        <div style={styles.field}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Roast Date</span>
            <InfoIcon t={t} message="When the beans were roasted. Pick Unknown if you're not sure." />
          </div>
          <div style={styles.dropdown} onClick={() => setShowDatePicker(true)}>
            <span style={{ color: roastDateUnknown ? t.textDim : t.text, fontStyle: roastDateUnknown ? "italic" : "normal" }}>
              {roastDateDisplay}
            </span>
            <span style={{ color: t.accent }}>›</span>
          </div>
        </div>

        {/* Roast Level Slider */}
        <div style={styles.field}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Roast Level</span>
          </div>
          <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, padding: "16px 14px", background: "transparent" }}>
            {/* Slider track */}
            <div style={{ position: "relative", height: 28, marginBottom: 16 }}>
              <input
                type="range"
                min={0}
                max={4}
                step={1}
                value={currentLevelIdx}
                onChange={e => setRoastLevel(ROAST_LEVELS[Number(e.target.value)].id)}
                style={{
                  position: "absolute",
                  width: "100%", height: "100%",
                  WebkitAppearance: "none",
                  appearance: "none",
                  background: "transparent",
                  zIndex: 2,
                  cursor: "pointer",
                  margin: 0,
                }}
              />
              {/* Custom track */}
              <div style={{
                position: "absolute",
                top: "50%", left: 0, right: 0,
                height: 4, background: t.border, borderRadius: 2,
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}>
                <div style={{
                  height: "100%",
                  width: `${(currentLevelIdx / 4) * 100}%`,
                  background: t.accent, borderRadius: 2,
                }} />
              </div>
              {/* Tick dots */}
              {ROAST_LEVELS.map((_, i) => (
                <div key={i} style={{
                  position: "absolute",
                  top: "50%", left: `${(i / 4) * 100}%`,
                  width: 12, height: 12,
                  borderRadius: "50%",
                  background: i <= currentLevelIdx ? t.accent : t.border,
                  border: `2px solid ${t.bg}`,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  boxShadow: i === currentLevelIdx ? `0 0 0 4px ${t.accent}33` : "none",
                }} />
              ))}
            </div>
            {/* Labels */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: t.textMuted, letterSpacing: 0.5, textTransform: "uppercase" }}>
              {["Light", "Lt-Md", "Med", "Md-Dk", "Dark"].map(l => (
                <span key={l} style={{ flex: 1, textAlign: "center" }}>{l}</span>
              ))}
            </div>
            <div style={{ textAlign: "center", fontSize: 12, color: t.accent, fontWeight: 500, marginTop: 10 }}>
              {ROAST_LEVELS[currentLevelIdx].label}
            </div>
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
                    <span style={{ fontSize: 9, color: t.textMuted, letterSpacing: 0.5, textTransform: "uppercase", marginLeft: 6 }}>Default</span>
                  )}
                </>
              ) : (
                <span style={{ color: t.textDim }}>{grinders.length === 0 ? "Add one in Settings" : "Select"}</span>
              )}
            </div>
            <span style={{ color: t.accent }}>›</span>
          </div>
        </div>

        {/* Setting + RPM */}
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
              <div onClick={() => setShowRpm(true)} style={{ width: "100%", padding: "12px 14px", background: t.bg3, borderRadius: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: t.textMuted, cursor: "pointer" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: t.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>+</div>
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

        <div style={{
          border: `1px dashed ${t.accent}`, borderRadius: 10,
          padding: "10px 14px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 14, background: "transparent",
        }}>
          <span style={{ fontSize: 10, color: t.textMuted, letterSpacing: 0.5, textTransform: "uppercase" }}>Ratio</span>
          <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontStyle: "italic", color: t.accent }}>{ratio}</span>
        </div>

        <div style={styles.field}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Notes</span>
            <InfoIcon t={t} message="Tasting notes or tweaks. Start with '1.', '*', or '-' for a list." />
          </div>
          <NumberedTextarea value={notes} onChange={setNotes} t={t} />
        </div>

        {error && <div style={{ fontSize: 12, color: "#E24B4A", marginBottom: 12, textAlign: "center" }}>{error}</div>}

      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <>
          <div onClick={() => setShowDatePicker(false)} style={{ position: "fixed", inset: 0, background: "rgba(28,26,19,0.55)", zIndex: 200 }} />
          <div style={{
            position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: "100%", maxWidth: 430,
            background: t.bg, borderRadius: "24px 24px 0 0",
            padding: "14px 22px 28px", zIndex: 201,
          }}>
            <div style={{ width: 40, height: 4, background: t.border, borderRadius: 2, margin: "0 auto 18px" }} />
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontStyle: "italic", textAlign: "center", color: t.text, marginBottom: 14 }}>
              Roast Date
            </div>

            {/* Unknown toggle */}
            <div
              onClick={() => setRoastDateUnknown(!roastDateUnknown)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 14px",
                background: t.bg2, border: `1px solid ${roastDateUnknown ? t.accent : t.border}`, borderRadius: 12,
                marginBottom: 14, cursor: "pointer",
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 6,
                border: `2px solid ${roastDateUnknown ? t.accent : t.border}`,
                background: roastDateUnknown ? t.accent : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 11, fontWeight: 700,
              }}>
                {roastDateUnknown && "✓"}
              </div>
              <span style={{ fontSize: 13, color: t.text }}>I don't know the roast date</span>
            </div>

            {!roastDateUnknown && (
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: t.textMuted, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>Month</div>
                  <select
                    value={roastMonth}
                    onChange={e => setRoastMonth(Number(e.target.value))}
                    style={{
                      width: "100%", padding: "12px 14px",
                      background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 12,
                      fontFamily: "'Outfit', sans-serif", fontSize: 14, color: t.text,
                      WebkitAppearance: "none", appearance: "none",
                      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(t.accent)}' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      paddingRight: 36,
                    }}
                  >
                    {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: t.textMuted, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>Day</div>
                  <select
                    value={roastDay}
                    onChange={e => setRoastDay(Number(e.target.value))}
                    style={{
                      width: "100%", padding: "12px 14px",
                      background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 12,
                      fontFamily: "'Outfit', sans-serif", fontSize: 14, color: t.text,
                      WebkitAppearance: "none", appearance: "none",
                      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(t.accent)}' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      paddingRight: 36,
                    }}
                  >
                    {Array.from({ length: daysInMonth(roastMonth) }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowDatePicker(false)}
              style={{
                width: "100%", padding: 14,
                background: t.accent, color: "#fff", border: "none", borderRadius: 12,
                fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Done
            </button>
          </div>
        </>
      )}

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
                      <span style={{ fontSize: 9, color: t.textMuted, letterSpacing: 0.5, textTransform: "uppercase", marginLeft: 6 }}>Default</span>
                    )}
                  </div>
                  {grinderId === g.id && <span>✓</span>}
                </div>
              ))
            )}
          </div>
        </>
      )}

    </div>
  );
}