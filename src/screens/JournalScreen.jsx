import { useState } from "react";
import NavBar from "../components/NavBar";
import { useJournal } from "../context/JournalContext";
import { EditIcon, TrashIcon, PlusIcon } from "../components/Icons";

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
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} · ${time}`;
}

function formatRoastDate(d) {
  if (!d) return null;
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
}

function calculateRatio(dose, yieldVal) {
  if (!dose || !yieldVal) return "—";
  const ratio = (yieldVal / dose).toFixed(1);
  return `1:${ratio}`;
}

function DrinkCard({ drink, onEdit, onDelete, t, s }) {
  return (
    <div style={s.entryCard}>
      <div style={s.entryHead}>
        <div>
          <div style={s.entryName}>{drink.name}</div>
          <div style={s.entryDate}>{formatDate(drink.created_at)}</div>
        </div>
        <div style={s.entryActions}>
          <div style={s.iconBtn} onClick={onEdit}><EditIcon color={t.textMuted} /></div>
          <div style={s.iconBtn} onClick={onDelete}><TrashIcon color={t.textMuted} /></div>
        </div>
      </div>
      <div style={s.entryMeta}>
        <div style={s.metaItem}>
          <span style={s.metaLabel}>Milk</span>
          <span style={drink.milk_type ? s.metaVal : s.metaValNone}>
            {drink.milk_type ? `${drink.milk_amount}${drink.milk_unit} ${drink.milk_type.toLowerCase()}` : "None"}
          </span>
        </div>
        <div style={s.metaItem}>
          <span style={s.metaLabel}>Coffee</span>
          <span style={s.metaVal}>{drink.coffee_used}</span>
        </div>
      </div>
      {drink.notes && (
        <div style={s.entryNotes}>"{drink.notes}"</div>
      )}
    </div>
  );
}

function EspressoCard({ entry, grinders, onEdit, onDelete, t, s }) {
  const grinder = grinders.find(g => g.id === entry.grinder_id);
  const roastIdx = ROAST_LEVELS.indexOf(entry.roast_level);
  const ratio = calculateRatio(entry.dose, entry.yield);
  const roastDate = formatRoastDate(entry.roast_date);

  return (
    <div style={s.entryCard}>
      <div style={s.entryHead}>
        <div>
          <div style={s.entryName}>{entry.bean_name}</div>
          <div style={s.entryDate}>
            {formatDate(entry.created_at)}
            {roastDate && ` · Roasted ${roastDate}`}
          </div>
        </div>
        <div style={s.entryActions}>
          <div style={s.iconBtn} onClick={onEdit}><EditIcon color={t.textMuted} /></div>
          <div style={s.iconBtn} onClick={onDelete}><TrashIcon color={t.textMuted} /></div>
        </div>
      </div>

      {entry.roast_level && (
        <div style={s.roastRow}>
          <span style={s.roastLabel}>Roast</span>
          <div style={{ display: "flex", gap: 3 }}>
            {ROAST_LEVELS.map((_, i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: i === roastIdx ? t.accent : t.border,
              }} />
            ))}
          </div>
          <span style={{ ...s.roastLabel, color: t.accent }}>{entry.roast_level}</span>
        </div>
      )}

      <div style={s.statsGrid}>
        <div style={s.statCell}>
          <div style={s.statVal}>{entry.dose}{entry.unit}</div>
          <div style={s.statLabel}>Dose</div>
        </div>
        <div style={s.statCell}>
          <div style={s.statVal}>{entry.yield}{entry.unit}</div>
          <div style={s.statLabel}>Yield</div>
        </div>
        <div style={s.statCell}>
          <div style={s.statVal}>{entry.brew_time ? `${entry.brew_time}s` : "—"}</div>
          <div style={s.statLabel}>Time</div>
        </div>
        <div style={{ ...s.statCell, borderRight: "none" }}>
          <div style={s.statVal}>{ratio}</div>
          <div style={s.statLabel}>Ratio</div>
        </div>
      </div>

      {(grinder || entry.grinder_setting) && (
        <div style={s.grindRow}>
          <span>Grind</span>
          <span style={s.grindVal}>
            {grinder?.name}
            {entry.grinder_setting && ` · ${entry.grinder_setting}`}
            {entry.grinder_rpm && ` · ${entry.grinder_rpm} RPM`}
          </span>
        </div>
      )}

      {entry.notes && (
        <div style={s.entryNotes}>"{entry.notes}"</div>
      )}
    </div>
  );
}

export default function JournalScreen({ navigate, s, t }) {
  const [tab, setTab] = useState("drinks");
  const [showPicker, setShowPicker] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { drinks, espresso, grinders, deleteDrink, deleteEspresso } = useJournal();

  const handleDelete = async () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === "drink") await deleteDrink(confirmDelete.id);
    else await deleteEspresso(confirmDelete.id);
    setConfirmDelete(null);
  };

  const journalStyles = {
    entryCard: { background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 14, padding: 14, marginBottom: 10 },
    entryHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
    entryName: { fontFamily: "'Libre Baskerville', serif", fontSize: 16, fontStyle: "italic", color: t.text, marginBottom: 3 },
    entryDate: { fontSize: 9, color: t.accent, letterSpacing: 1, textTransform: "uppercase" },
    entryActions: { display: "flex", gap: 6, marginLeft: 10 },
    iconBtn: { width: 28, height: 28, borderRadius: 7, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
    entryMeta: { display: "flex", gap: 14, flexWrap: "wrap", marginTop: 6, paddingTop: 8, borderTop: `1px solid ${t.border}` },
    metaItem: { display: "flex", flexDirection: "column" },
    metaLabel: { fontSize: 9, color: t.textMuted, letterSpacing: 0.5, textTransform: "uppercase" },
    metaVal: { fontSize: 11, color: t.text, fontWeight: 400 },
    metaValNone: { fontSize: 11, color: t.textDim, fontStyle: "italic" },
    entryNotes: { marginTop: 8, fontSize: 11, color: t.textMuted, fontWeight: 300, lineHeight: 1.5, fontStyle: "italic" },
    roastRow: { display: "flex", alignItems: "center", gap: 6, marginBottom: 8 },
    roastLabel: { fontSize: 9, color: t.textMuted, letterSpacing: 0.5, textTransform: "uppercase" },
    statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, margin: "6px 0" },
    statCell: { padding: "8px 0", textAlign: "center", borderRight: `1px solid ${t.border}` },
    statVal: { fontSize: 13, fontWeight: 500, color: t.text },
    statLabel: { fontSize: 8, color: t.textMuted, letterSpacing: 0.5, textTransform: "uppercase", marginTop: 2 },
    grindRow: { display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 11, color: t.textMuted },
    grindVal: { color: t.text, fontWeight: 400 },
  };

  const list = tab === "drinks" ? drinks : espresso;

  return (
    <div>
      <div style={{ ...s.header, display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 20 }}>
        <div>
          <div style={s.pageTitle}>Journal</div>
          <div style={s.pageSub}>Log every brew, track your favorites.</div>
        </div>
        <div
          onClick={() => setShowPicker(true)}
          style={{
            width: 36, height: 36, borderRadius: "50%", background: t.accent,
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", marginTop: 4,
          }}
        >
          <PlusIcon size={18} color="#fff" />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", margin: "0 26px", borderBottom: `1px solid ${t.border}` }}>
        <div
          onClick={() => setTab("drinks")}
          style={{
            padding: "14px 0", textAlign: "center", fontSize: 13,
            fontWeight: tab === "drinks" ? 500 : 400,
            color: tab === "drinks" ? t.text : t.textMuted,
            borderBottom: tab === "drinks" ? `2px solid ${t.accent}` : "2px solid transparent",
            marginBottom: -1, cursor: "pointer",
          }}
        >
          Coffee Drinks
        </div>
        <div
          onClick={() => setTab("espresso")}
          style={{
            padding: "14px 0", textAlign: "center", fontSize: 13,
            fontWeight: tab === "espresso" ? 500 : 400,
            color: tab === "espresso" ? t.text : t.textMuted,
            borderBottom: tab === "espresso" ? `2px solid ${t.accent}` : "2px solid transparent",
            marginBottom: -1, cursor: "pointer",
          }}
        >
          Espresso
        </div>
      </div>

      {/* Entries */}
      <div style={{ padding: "14px 26px 0" }}>
        {list.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: t.textMuted, fontSize: 13, fontWeight: 300 }}>
            No entries yet. Tap the + button to log your first brew.
          </div>
        ) : (
          list.map(item =>
            tab === "drinks"
              ? <DrinkCard key={item.id} drink={item} t={t} s={journalStyles}
                  onEdit={() => navigate("DrinkEntryForm", item)}
                  onDelete={() => setConfirmDelete({ type: "drink", id: item.id, name: item.name })}
                />
              : <EspressoCard key={item.id} entry={item} grinders={grinders} t={t} s={journalStyles}
                  onEdit={() => navigate("EspressoEntryForm", item)}
                  onDelete={() => setConfirmDelete({ type: "espresso", id: item.id, name: item.bean_name })}
                />
          )
        )}
      </div>

      {/* Picker bottom sheet */}
      {showPicker && (
        <>
          <div onClick={() => setShowPicker(false)} style={{ position: "fixed", inset: 0, background: "rgba(28,26,19,0.55)", zIndex: 200 }} />
          <div style={{
            position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: "100%", maxWidth: 430,
            background: t.bg, borderRadius: "24px 24px 0 0",
            padding: "14px 22px 28px", zIndex: 201,
            boxShadow: "0 -8px 30px rgba(0,0,0,0.15)",
          }}>
            <div style={{ width: 40, height: 4, background: t.border, borderRadius: 2, margin: "0 auto 18px" }} />
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 20, fontStyle: "italic", textAlign: "center", color: t.text, marginBottom: 4 }}>
              What are you logging?
            </div>
            <div style={{ textAlign: "center", fontSize: 12, color: t.textMuted, fontWeight: 300, marginBottom: 20 }}>
              Pick the type of entry to create.
            </div>

            <div
              onClick={() => { setShowPicker(false); navigate("DrinkEntryForm"); }}
              style={{ padding: 16, background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 14, marginBottom: 10, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <div>
                <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 15, fontStyle: "italic", color: t.text, marginBottom: 2 }}>Coffee Drink</div>
                <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 300 }}>Latte, pour over, cold brew, etc.</div>
              </div>
              <span style={{ color: t.accent, fontSize: 18 }}>›</span>
            </div>

            <div
              onClick={() => { setShowPicker(false); navigate("EspressoEntryForm"); }}
              style={{ padding: 16, background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 14, marginBottom: 12, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <div>
                <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 15, fontStyle: "italic", color: t.text, marginBottom: 2 }}>Espresso Shot</div>
                <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 300 }}>Dial in your dose, yield, and grind.</div>
              </div>
              <span style={{ color: t.accent, fontSize: 18 }}>›</span>
            </div>

            <button
              onClick={() => setShowPicker(false)}
              style={{ width: "100%", padding: 14, background: "transparent", border: `1px solid ${t.border}`, borderRadius: 12, fontFamily: "'Outfit', sans-serif", fontSize: 13, color: t.textMuted, cursor: "pointer" }}
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
              Delete entry?
            </div>
            <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 300, marginBottom: 18, lineHeight: 1.5 }}>
              "{confirmDelete.name}" will be permanently removed.
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

      <NavBar current="Journal" navigate={navigate} s={s} t={t} />
    </div>
  );
}