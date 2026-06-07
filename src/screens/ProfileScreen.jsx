// import { useState } from "react";
// import NavBar from "../components/NavBar";
// import { METHODS } from "../data/methods";
// import { useAuth } from "../context/AuthContext";

// export default function ProfileScreen({ navigate, s, t, units, setUnits, defaultMethod, setDefaultMethod, isDark, setIsDark }) {
//   const { user, signOut } = useAuth();
//   const [showMethodPicker, setShowMethodPicker] = useState(false);

//   const handleSignOut = async () => {
//     await signOut();
//   };

//   const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Brewly User";
//   const avatar = user?.user_metadata?.avatar_url;
//   const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

//   return (
//     <div>
//       <div style={s.header}>
//         <div style={s.pageTitle}>Preferences</div>
//         <div style={s.pageSub}>Make Brewly yours.</div>
//       </div>

//       {/* User Card */}
//       <div style={{ ...s.section }}>
//         <div style={{ background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 16, padding: "18px", display: "flex", alignItems: "center", gap: 14 }}>
//           {avatar ? (
//             <img src={avatar} alt={name} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
//           ) : (
//             <div style={{ width: 52, height: 52, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 500, color: "#111009", flexShrink: 0 }}>
//               {initials}
//             </div>
//           )}
//           <div style={{ flex: 1 }}>
//             <div style={{ fontSize: 15, fontWeight: 500, color: t.text, marginBottom: 2 }}>{name}</div>
//             <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 300 }}>{user?.email}</div>
//           </div>
//         </div>
//       </div>

//       {/* Appearance */}
//       <div style={{ ...s.section, marginTop: 24 }}>
//         <div style={s.sectionTitle}>Appearance</div>
//         <div style={s.settingGroup}>
//           <div style={s.settingRow(true)}>
//             <div>
//               <div style={s.settingName}>Theme</div>
//               <div style={s.settingDesc}>Switch between dark and light mode</div>
//             </div>
//             <div style={s.toggleWrap}>
//               <div style={s.toggleOpt(!isDark)} onClick={() => setIsDark(false)}>Light</div>
//               <div style={s.toggleOpt(isDark)} onClick={() => setIsDark(true)}>Dark</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Brewing */}
//       <div style={{ ...s.section, marginTop: 24 }}>
//         <div style={s.sectionTitle}>Brewing</div>
//         <div style={s.settingGroup}>
//           <div style={s.settingRow(false)}>
//             <div>
//               <div style={s.settingName}>Units</div>
//               <div style={s.settingDesc}>Measurements across all recipes</div>
//             </div>
//             <div style={s.toggleWrap}>
//               <div style={s.toggleOpt(units === "ml")} onClick={() => setUnits("ml")}>ml</div>
//               <div style={s.toggleOpt(units === "oz")} onClick={() => setUnits("oz")}>oz</div>
//             </div>
//           </div>
//           <div style={s.settingRow(true)}>
//             <div>
//               <div style={s.settingName}>Default brew method</div>
//               <div style={s.settingDesc}>Shown first on the methods screen</div>
//             </div>
//             <div style={s.methodSelect} onClick={() => setShowMethodPicker(!showMethodPicker)}>
//               {defaultMethod} <span style={{ fontSize: 14 }}>›</span>
//             </div>
//           </div>
//         </div>

//         {showMethodPicker && (
//           <div style={{ ...s.settingGroup, marginTop: 8 }}>
//             {METHODS.map((m, i) => (
//               <div
//                 key={m.name}
//                 style={{ ...s.settingRow(i === METHODS.length - 1), cursor: "pointer" }}
//                 onClick={() => { setDefaultMethod(m.name); setShowMethodPicker(false); }}
//               >
//                 <div style={{ ...s.settingName, color: defaultMethod === m.name ? t.accent : t.text }}>{m.name}</div>
//                 {defaultMethod === m.name && <span style={{ color: t.accent }}>✓</span>}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* About */}
//       <div style={{ ...s.section, marginTop: 24 }}>
//         <div style={s.sectionTitle}>About</div>
//         <div style={s.aboutGroup}>
//           <div style={s.aboutRow(false)}><div style={s.aboutName}>What is Brewly?</div><div style={s.aboutArrow}>›</div></div>
//           <div style={s.aboutRow(false)}><div style={s.aboutName}>Send feedback</div><div style={s.aboutArrow}>›</div></div>
//           <div style={s.aboutRow(true)}><div style={s.aboutName}>Privacy policy</div><div style={s.aboutArrow}>›</div></div>
//         </div>
//       </div>

//       {/* Sign Out */}
//       <div style={{ padding: "24px 26px 0" }}>
//         <button onClick={handleSignOut} style={{
//           width: "100%", padding: 16, borderRadius: 14,
//           border: `1px solid ${t.border}`, background: "transparent",
//           fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500,
//           color: "#E24B4A", cursor: "pointer",
//         }}>
//           Sign Out
//         </button>
//       </div>

//       <div style={s.version}>
//         <span style={s.versionSpan}>brewly</span> · v1.0.0
//       </div>

//       <NavBar current="Profile" navigate={navigate} s={s} t={t} />
//     </div>
//   );
// }

import { useState } from "react";
import NavBar from "../components/NavBar";
import { METHODS } from "../data/methods";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({ navigate, s, t, units, setUnits, defaultMethod, setDefaultMethod, isDark, setIsDark }) {
  const { user, signOut } = useAuth();
  const [showMethodPicker, setShowMethodPicker] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Brewly User";
  const avatar = user?.user_metadata?.avatar_url;
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div>
      <div style={s.header}>
        <div style={s.pageTitle}>Preferences</div>
        <div style={s.pageSub}>Make Brewly yours.</div>
      </div>

      {/* User Card */}
      <div style={{ ...s.section }}>
        <div style={{ background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 16, padding: "18px", display: "flex", alignItems: "center", gap: 14 }}>
          {avatar ? (
            <img src={avatar} alt={name} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
          ) : (
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 500, color: "#111009", flexShrink: 0 }}>
              {initials}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: t.text, marginBottom: 2 }}>{name}</div>
            <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 300 }}>{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div style={{ ...s.section, marginTop: 24 }}>
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

      {/* Brewing */}
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
          <div style={s.settingRow(false)}>
            <div>
              <div style={s.settingName}>Default brew method</div>
              <div style={s.settingDesc}>Shown first on the methods screen</div>
            </div>
            <div style={s.methodSelect} onClick={() => setShowMethodPicker(!showMethodPicker)}>
              {defaultMethod} <span style={{ fontSize: 14 }}>›</span>
            </div>
          </div>
          <div style={{ ...s.settingRow(true), cursor: "pointer" }} onClick={() => navigate("Grinders")}>
            <div>
              <div style={s.settingName}>My Grinders</div>
              <div style={s.settingDesc}>Manage saved grinders for journaling</div>
            </div>
            <span style={{ fontSize: 14, color: t.textMuted }}>›</span>
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

      {/* About */}
      <div style={{ ...s.section, marginTop: 24 }}>
        <div style={s.sectionTitle}>About</div>
        <div style={s.aboutGroup}>
          <div style={s.aboutRow(false)}><div style={s.aboutName}>What is Brewly?</div><div style={s.aboutArrow}>›</div></div>
          <div style={s.aboutRow(false)}><div style={s.aboutName}>Send feedback</div><div style={s.aboutArrow}>›</div></div>
          <div style={s.aboutRow(true)}><div style={s.aboutName}>Privacy policy</div><div style={s.aboutArrow}>›</div></div>
        </div>
      </div>

      {/* Sign Out */}
      <div style={{ padding: "24px 26px 0" }}>
        <button onClick={handleSignOut} style={{
          width: "100%", padding: 16, borderRadius: 14,
          border: `1px solid ${t.border}`, background: "transparent",
          fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500,
          color: "#E24B4A", cursor: "pointer",
        }}>
          Sign Out
        </button>
      </div>

      <div style={s.version}>
        <span style={s.versionSpan}>brewly</span> · v1.0.0
      </div>

      <NavBar current="Profile" navigate={navigate} s={s} t={t} />
    </div>
  );
}