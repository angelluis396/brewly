import { CoffeeCupIcon } from "./Icons";

/**
 * CustomDrinkCard — shows a user-created journal drink recipe.
 *
 * Props:
 *  - drink: the journal_drinks row
 *  - onClick: navigation handler
 *  - t: theme object
 *  - variant: "card" (default, vertical card for horizontal scroll) | "single" (wide horizontal card)
 */
export default function CustomDrinkCard({ drink, onClick, t, variant = "card" }) {
  // Format meta line: "{coffee} · {milk_amount}{milk_unit} {milk_type}"
  const metaParts = [];
  if (drink.coffee_used) metaParts.push(drink.coffee_used);
  if (drink.milk_type) {
    if (drink.milk_amount) {
      metaParts.push(`${drink.milk_amount}${drink.milk_unit} ${drink.milk_type}`);
    } else {
      metaParts.push(drink.milk_type);
    }
  }
  const metaLine = metaParts.join(" · ");

  if (variant === "single") {
    return (
      <div
        onClick={onClick}
        style={{
          border: `2px dashed ${t.accent}88`,
          borderRadius: 14,
          padding: 14,
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "12px 0 4px",
          cursor: "pointer",
          background: "transparent",
        }}
      >
        <div style={{
          width: 56, height: 56,
          background: t.bg3,
          borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: t.accent,
          flexShrink: 0,
        }}>
          <CoffeeCupIcon size={28} color={t.accent} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: t.accent, fontWeight: 500 }}>
            Custom
          </div>
          <div style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: 16, fontStyle: "italic", color: t.text,
            marginTop: 2,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {drink.name}
          </div>
          {metaLine && (
            <div style={{
              fontSize: 11, color: t.textMuted, marginTop: 4,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {metaLine}
            </div>
          )}
        </div>
        <span style={{ color: t.accent, fontSize: 18 }}>›</span>
      </div>
    );
  }

  // Default "card" variant for horizontal scroll
  return (
    <div
      onClick={onClick}
      style={{
        flex: "0 0 140px",
        background: "transparent",
        border: `2px dashed ${t.accent}88`,
        borderRadius: 14,
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <div style={{
        height: 110,
        background: t.bg3,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: t.accent,
      }}>
        <CoffeeCupIcon size={32} color={t.accent} />
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: t.accent, fontWeight: 500 }}>
          Custom
        </div>
        <div style={{
          fontFamily: "'Libre Baskerville', serif",
          fontSize: 13, fontStyle: "italic", color: t.text,
          marginTop: 2,
          overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
        }}>
          {drink.name}
        </div>
      </div>
    </div>
  );
}