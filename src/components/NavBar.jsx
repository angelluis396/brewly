export default function NavBar({ current, navigate, s, t }) {
  const items = ["Home", "Recipes", "Methods", "Profile"];
  return (
    <div style={{
      ...s.navBar,
      position: "sticky",
      bottom: 0,
      background: t.bg,
      borderTop: `1px solid ${t.border}`,
      marginTop: 28,
      zIndex: 100,
    }}>
      {items.map(item => (
        <div key={item} style={s.navItem(current === item)} onClick={() => navigate(item)}>
          <div style={s.navLine(current === item)} />
          {item}
        </div>
      ))}
    </div>
  );
}