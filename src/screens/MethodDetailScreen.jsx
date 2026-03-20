import NavBar from "../components/NavBar";

const GRIND_HEIGHTS = [16, 22, 30, 38, 44, 48, 52];

export default function MethodDetailScreen({ item, navigate, s, t, units }) {
  const specs = units === "ml" ? item.specs_ml : item.specs_oz;
  const yieldVal = units === "ml" ? `${item.yield_ml}ml` : `${item.yield_oz}oz`;

  return (
    <div>
      <div style={s.header}>
        <div style={s.backRow}>
          <span style={s.backArrow} onClick={() => navigate("Methods")}>←</span>
          <span style={s.backLabel} onClick={() => navigate("Methods")}>Brew Methods</span>
        </div>
        <div style={s.heroRow}>
          <div style={s.heroImgWrap}>
            <img style={s.heroImg} src={item.imgSm} alt={item.name} />
          </div>
          <div style={s.heroText}>
            <div style={s.heroLabel}>Brew Method · {item.brewType}</div>
            <div style={s.heroName}>{item.name}</div>
            <div style={s.heroTags}>
              {item.tags.map(tag => <div key={tag} style={s.heroTag}>{tag}</div>)}
            </div>
          </div>
        </div>
      </div>

      <div style={s.statStrip}>
        {[
          [item.brewTime, "Brew time"],
          [item.temp, "Temp"],
          [item.ratio, "Ratio"],
          [yieldVal, "Yield"],
        ].map(([val, label], i, arr) => (
          <div key={label} style={s.statItem(i === arr.length - 1)}>
            <div style={s.statVal}>{val}</div>
            <div style={s.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Grind Size</div>
        <div style={s.grindCard}>
          <div style={s.grindTrack}>
            {GRIND_HEIGHTS.map((h, i) => (
              <div key={i} style={{ ...s.grindBar(i === item.grindPos - 1 || i === item.grindPos), height: h }} />
            ))}
          </div>
          <div style={s.grindLabels}>
            <span style={s.grindLabel(item.grindPos <= 2)}>Fine</span>
            <span style={s.grindLabel(item.grindPos >= 3 && item.grindPos <= 4)}>{item.grindLabel} ←</span>
            <span style={s.grindLabel(item.grindPos >= 5)}>Coarse</span>
          </div>
        </div>
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Brew Specs</div>
        {specs.map(spec => (
          <div key={spec.name} style={s.specRow}>
            <span style={s.specName}>{spec.name}</span>
            <span style={s.specVal}>{spec.val}</span>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Directions</div>
        <div style={s.steps}>
          {item.steps.map((step, i) => (
            <div key={i} style={s.stepRow}>
              <div style={s.stepNumWrap}>
                <div style={s.stepNum}>{i + 1}</div>
                {i < item.steps.length - 1 && <div style={s.stepLine} />}
              </div>
              <div style={{ ...s.stepBody, paddingBottom: i < item.steps.length - 1 ? 16 : 0 }}>
                <div style={s.stepTitle}>{step.title}</div>
                <div style={s.stepDesc}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Barista Tips</div>
        <div style={s.tipsCard}>
          <div style={s.tipsIcon}>💡</div>
          <div>
            <div style={s.tipsTitle}>Pro tip</div>
            <div style={s.tipsBody}>{item.tip}</div>
          </div>
        </div>
      </div>

      <button style={s.saveBtn}>♥ &nbsp;Save to Favorites</button>
      <NavBar current="Methods" navigate={navigate} s={s} t={t} />
    </div>
  );
}