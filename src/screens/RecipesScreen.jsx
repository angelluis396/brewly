import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../components/NavBar";
import { RECIPES, RECIPE_GROUPS, STRENGTH_ORDER } from "../data/recipes";
import { useJournal } from "../context/JournalContext";
import CustomDrinkCard from "../components/CustomDrinkCard";
import EmptyMyDrinks from "../components/EmptyMyDrinks";
import { ChevronDownIcon } from "../components/Icons";

const FILTERS = ["All", "Mild", "Bold", "Extra Bold"];

// Rotating hero image preview shown when section is collapsed
function CollapsedPreview({ items, onExpand, t }) {
  const [activeIdx, setActiveIdx] = useState(0);
  // Use up to 5 items for the rotation
  const previewItems = items.slice(0, 5);

  // Auto-rotate every 3 seconds
  useEffect(() => {
    if (previewItems.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % previewItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [previewItems.length]);

  if (previewItems.length === 0) return null;
  const active = previewItems[activeIdx];

  return (
    <div
      onClick={onExpand}
      style={{
        position: "relative",
        height: 140,
        borderRadius: 14,
        overflow: "hidden",
        margin: "8px 0 16px",
        cursor: "pointer",
      }}
    >
      <AnimatePresence mode="sync">
        <motion.img
          key={active.id}
          src={active.img}
          alt={active.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
          }}
        />
      </AnimatePresence>
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
        padding: 14,
        color: "#fff",
      }}>
        <div style={{
          fontFamily: "'Libre Baskerville', serif",
          fontStyle: "italic", fontSize: 16,
        }}>
          {active.name}
        </div>
        <div style={{
          fontSize: 10, color: "rgba(255,255,255,0.85)",
          letterSpacing: 0.5, textTransform: "uppercase",
          marginTop: 2,
        }}>
          Tap to view all
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
          {previewItems.map((_, i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: "50%",
              background: i === activeIdx ? "#fff" : "rgba(255,255,255,0.4)",
              transition: "background 0.3s ease",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RecipesScreen({ navigate, s, t }) {
  const [filter, setFilter] = useState("All");
  const [espressoOpen, setEspressoOpen] = useState(true);
  const [myDrinksOpen, setMyDrinksOpen] = useState(true);
  const { drinks } = useJournal();

  // Combine groups and standalone recipes into one sorted list
  const allItems = [
    ...RECIPE_GROUPS.map(g => ({ ...g, isGroup: true })),
    ...RECIPES.map(r => ({ ...r, isGroup: false })),
  ].sort((a, b) => a.name.localeCompare(b.name));

  const filtered = filter === "All"
    ? allItems
    : allItems.filter(item => item.strength === filter);

  const handleCardClick = (item) => {
    if (item.isGroup) navigate("VariantDetail", item);
    else navigate("RecipeDetail", item);
  };

  const sectionHeaderStyle = {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 0", cursor: "pointer", userSelect: "none",
  };

  const sectionTitleStyle = {
    fontFamily: "'Libre Baskerville', serif",
    fontSize: 18, fontStyle: "italic", color: t.text,
  };

  const sectionCountStyle = {
    fontSize: 10, color: t.textMuted, letterSpacing: 0.5,
    textTransform: "uppercase", marginLeft: 8,
  };

  return (
    <div>
      <div style={s.header}>
        <div style={s.backRow}>
          <span style={s.backArrow} onClick={() => navigate("Home")}>←</span>
          <span style={s.backLabel} onClick={() => navigate("Home")}>Home</span>
        </div>
        <div style={s.pageTitle}>Espresso Drinks</div>
        <div style={s.pageSub}>{allItems.length} drinks · find your perfect cup</div>
      </div>

      <div style={s.filterRow}>
        {FILTERS.map(f => (
          <div key={f} style={s.filterChip(filter === f)} onClick={() => setFilter(f)}>
            {f !== "All" && (
              <span style={{ marginRight: 6 }}>
                {"●".repeat(STRENGTH_ORDER[f])}{"○".repeat(3 - STRENGTH_ORDER[f])}
              </span>
            )}
            {f}
          </div>
        ))}
      </div>

      {/* ─── Espresso Drinks section ───────────────────────────── */}
      <div style={{ padding: "0 26px" }}>
        <div
          style={sectionHeaderStyle}
          onClick={() => setEspressoOpen(!espressoOpen)}
        >
          <div>
            <span style={sectionTitleStyle}>Espresso Drinks</span>
            <span style={sectionCountStyle}>{filtered.length} drinks</span>
          </div>
          <motion.div
            animate={{ rotate: espressoOpen ? 0 : -90 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          >
            <ChevronDownIcon size={14} color={t.accent} />
          </motion.div>
        </div>

        <AnimatePresence initial={false} mode="wait">
          {espressoOpen ? (
            <motion.div
              key="expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 4, paddingBottom: 16 }}>
                {filtered.map(item => (
                  <div key={item.id} style={s.bigCard} onClick={() => handleCardClick(item)}>
                    <div style={s.imgWrap}>
                      <img style={s.bigCardImg} src={item.img} alt={item.name} />
                      <div style={s.badge}>{item.strength}</div>
                      {item.isGroup && (
                        <div style={{
                          position: "absolute", bottom: 14, left: 14,
                          display: "flex", gap: 5,
                        }}>
                          {item.variants.map(v => (
                            <div key={v.id} style={{
                              background: "rgba(0,0,0,0.55)",
                              borderRadius: 99, padding: "3px 8px",
                              fontSize: 9, color: "#F2EDE4", letterSpacing: 0.5,
                              textTransform: "uppercase",
                            }}>
                              {v.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={s.bigCardBody}>
                      <div>
                        <div style={s.bigCardLabel}>{item.label}</div>
                        <div style={s.bigCardName}>{item.name}</div>
                      </div>
                      <div style={s.bigCardRight}>
                        <div style={s.bigCardTime}>{item.time}</div>
                        <div style={s.goBtn}>→</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              style={{ overflow: "hidden" }}
            >
              <CollapsedPreview
                items={filtered}
                onExpand={() => setEspressoOpen(true)}
                t={t}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── My Drinks section ─────────────────────────────── */}
        <div
          style={sectionHeaderStyle}
          onClick={() => setMyDrinksOpen(!myDrinksOpen)}
        >
          <div>
            <span style={sectionTitleStyle}>My Drinks</span>
            <span style={sectionCountStyle}>
              {drinks.length === 0
                ? "no custom recipes?"
                : `${drinks.length} recipe${drinks.length === 1 ? "" : "s"}`}
            </span>
          </div>
          <motion.div
            animate={{ rotate: myDrinksOpen ? 0 : -90 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          >
            <ChevronDownIcon size={14} color={t.accent} />
          </motion.div>
        </div>

        <AnimatePresence initial={false}>
          {myDrinksOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ paddingBottom: 16 }}>
                {drinks.length === 0 ? (
                  <EmptyMyDrinks
                    t={t}
                    onCreateClick={() => navigate("Journal")}
                  />
                ) : drinks.length === 1 ? (
                  <CustomDrinkCard
                    drink={drinks[0]}
                    t={t}
                    variant="single"
                    onClick={() => navigate("DrinkEntryDetail", drinks[0])}
                  />
                ) : (
                  <div style={{
                    display: "flex", gap: 10,
                    overflowX: "auto",
                    padding: "12px 2px 4px",
                    margin: "0 -4px",
                  }}>
                    {drinks.map(drink => (
                      <CustomDrinkCard
                        key={drink.id}
                        drink={drink}
                        t={t}
                        variant="card"
                        onClick={() => navigate("DrinkEntryDetail", drink)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <NavBar current="Recipes" navigate={navigate} s={s} t={t} />
    </div>
  );
}