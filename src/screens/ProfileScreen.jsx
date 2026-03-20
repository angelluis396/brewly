import { useState } from "react";
import NavBar from "../components/NavBar";
import { METHODS } from "../data/methods";

export default function ProfileScreen({ navigate, s, t, units, setUnits, defaultMethod, setDefaultMethod, isDark, setIsDark }) {
  const [showMethodPicker, setShowMethodPicker] = useState(false);

  return (
    <div>
      <div style={s.header}>
        <div style={s.pageTitle}>Preferences</div>
        <div style={s.pageSub}>Make Brewly yours.</div>
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Appearance</div>
        <div style={s.settingGroup}>
          <div style={s.settingRow(true)}>
            <div>
              <div style={s.settingName}>Theme</div>
              <div style={s.settingDesc}>Switch between dark and light mode</div>
            </div>
            <div style={s.toggleWrap}>
              <div style={s.toggleOpt(!isDark)} onClick={() => setIsDark(false)}>Light</div>
              <div style={s.toggleOpt(isDark)} onClick={() => setIsDark(true)}>Dark</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...s.section, marginTop: 24 }}>
        <div style={s.sectionTitle}>Brewing</div>
        <div style={s.settingGroup}>
          <div style={s.settingRow(false)}>
            <div>
              <div style={s.settingName}>Units</div>
              <div style={s.settingDesc}>Measurements across all recipes</div>
            </div>
            <div style={s.toggleWrap}>
              <div style={s.toggleOpt(units === "ml")} onClick={() => setUnits("ml")}>ml</div>
              <div style={s.toggleOpt(units === "oz")} onClick={() => setUnits("oz")}>oz</div>
            </div>
          </div>
          <div style={s.settingRow(true)}>
            <div>
              <div style={s.settingName}>Default brew method</div>
              <div style={s.settingDesc}>Shown first on the methods screen</div>
            </div>
            <div style={s.methodSelect} onClick={() => setShowMethodPicker(!showMethodPicker)}>
              {defaultMethod} <span style={{ fontSize: 14 }}>›</span>
            </div>
          </div>
        </div>

        {showMethodPicker && (
          <div style={{ ...s.settingGroup, marginTop: 8 }}>
            {METHODS.map((m, i) => (
              <div
                key={m.name}
                style={{ ...s.settingRow(i === METHODS.length - 1), cursor: "pointer" }}
                onClick={() => { setDefaultMethod(m.name); setShowMethodPicker(false); }}
              >
                <div style={{ ...s.settingName, color: defaultMethod === m.name ? t.accent : t.text }}>{m.name}</div>
                {defaultMethod === m.name && <span style={{ color: t.accent }}>✓</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ ...s.section, marginTop: 24 }}>
        <div style={s.sectionTitle}>About</div>
        <div style={s.aboutGroup}>
          <div style={s.aboutRow(false)}><div style={s.aboutName}>What is Brewly?</div><div style={s.aboutArrow}>›</div></div>
          <div style={s.aboutRow(false)}><div style={s.aboutName}>Send feedback</div><div style={s.aboutArrow}>›</div></div>
          <div style={s.aboutRow(true)}><div style={s.aboutName}>Privacy policy</div><div style={s.aboutArrow}>›</div></div>
        </div>
      </div>

      <div style={s.version}>
        <span style={s.versionSpan}>brewly</span> · v1.0.0
      </div>

      <NavBar current="Profile" navigate={navigate} s={s} t={t} />
    </div>
  );
}