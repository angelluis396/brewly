import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../components/NavBar";
import { RECIPES, RECIPE_GROUPS } from "../data/recipes";
import { useJournal } from "../context/JournalContext";
import CustomDrinkCard from "../components/CustomDrinkCard";
import EmptyMyDrinks from "../components/EmptyMyDrinks";
import { ChevronDownIcon } from "../components/Icons";

export default function RecipesScreen({ navigate, s, t }) {
  const [espressoOpen, setEspressoOpen] = useState(true);
  const [myDrinksOpen, setMyDrinksOpen] = useState(true);
  const { drinks } = useJournal();

  const allItems = [
    ...RECIPE_GROUPS.map(g => ({ ...g, isGroup: true })),
    ...RECIPES.map(r => ({ ...r, isGroup: false })),
  ].sort((a, b) => a.name.localeCompare(b.name));

  const filtered = allItems;

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
        <div style={s.pageTitle}>Coffee Recipes</div>
        <div style={s.pageSub}>{allItems.length} drinks · find your perfect cup</div>
      </div>

      <div style={{ padding: "0 26px" }}>
        {/* ─── Espresso Drinks section ───────────────────────────── */}
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

        <AnimatePresence initial={false}>
          {espressoOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{
                display: "flex", gap: 10,
                overflowX: "auto",
                padding: "12px 2px 4px",
                margin: "0 -4px",
                paddingBottom: 16,
              }}>
                {filtered.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleCardClick(item)}
                    style={{
                      flex: "0 0 140px",
                      background: t.bg2,
                      border: `1px solid ${t.border}`,
                      borderRadius: 14,
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ position: "relative", height: 110 }}>
                      <img
                        src={item.img}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      {item.isGroup && (
                        <div style={{
                          position: "absolute", bottom: 6, left: 6,
                          display: "flex", gap: 3,
                        }}>
                          {item.variants.slice(0, 2).map(v => (
                            <div key={v.id} style={{
                              background: "rgba(0,0,0,0.55)",
                              borderRadius: 99, padding: "2px 6px",
                              fontSize: 8, color: "#F2EDE4", letterSpacing: 0.4,
                              textTransform: "uppercase",
                            }}>
                              {v.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "10px 12px" }}>
                      <div style={{
                        fontSize: 9, letterSpacing: 1, textTransform: "uppercase",
                        color: t.accent, fontWeight: 500,
                      }}>
                        {item.strength}
                      </div>
                      <div style={{
                        fontFamily: "'Libre Baskerville', serif",
                        fontSize: 13, fontStyle: "italic", color: t.text,
                        marginTop: 2,
                        overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
                      }}>
                        {item.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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