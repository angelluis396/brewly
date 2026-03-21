import { useState } from "react";
import NavBar from "../components/NavBar";
import { METHODS } from "../data/methods";

const FILTERS = ["All", "Pressure", "Immersion", "Percolation"];

export default function MethodsScreen({ navigate, s, t }) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? METHODS : METHODS.filter(m => m.brewType === filter);

  return (
    <div>
      <div style={s.header}>
        <div style={s.backRow}>
          <span style={s.backArrow} onClick={() => navigate("Home")}>←</span>
          <span style={s.backLabel} onClick={() => navigate("Home")}>Home</span>
        </div>
        <div style={s.pageTitle}>Methods</div>
        <div style={s.pageSub}>{METHODS.length} methods · from bean to cup</div>
      </div>

      <div style={s.filterRow}>
        {FILTERS.map(f => (
          <div key={f} style={s.filterChip(filter === f)} onClick={() => setFilter(f)}>{f}</div>
        ))}
      </div>

      <div style={s.countRow}>Showing {filtered.length} method{filtered.length !== 1 ? "s" : ""}</div>

      <div style={s.cards}>
        {filtered.map(m => (
          <div key={m.id} style={s.bigCard} onClick={() => navigate("MethodDetail", m)}>
            <div style={s.imgWrap}>
              <img style={s.bigCardImg} src={m.img} alt={m.name} />
              <div style={s.badge}>{m.brewType}</div>
            </div>
            <div style={s.bigCardBody}>
              <div>
                <div style={s.bigCardLabel}>{m.label}</div>
                <div style={s.bigCardName}>{m.name}</div>
              </div>
              <div style={s.bigCardRight}>
                <div style={s.bigCardTime}>{m.time}</div>
                <div style={s.goBtn}>→</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <NavBar current="Methods" navigate={navigate} s={s} t={t} />
    </div>
  );
}