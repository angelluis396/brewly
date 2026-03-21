import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigate, s, t }) {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) return setError("Please fill in all fields.");
    setLoading(true);
    setError("");
    const { error } = await signIn(email, password);
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

  return (
    <div style={{ ...s.app, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh", padding: "0 26px" }}>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={s.logo}>brew<em style={s.logoEm}>ly</em></div>
        <div style={s.tagline}>Your back pocket barista.</div>
      </div>

      {/* Google Button */}
      <button onClick={handleGoogle} style={{
        width: "100%", padding: "14px 0", borderRadius: 14,
        border: `1px solid ${t.border}`, background: t.bg2,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        cursor: "pointer", marginBottom: 16,
        fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500, color: t.text,
      }}>
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1, background: t.border }} />
        <span style={{ fontSize: 11, color: t.textMuted, letterSpacing: 1 }}>OR</span>
        <div style={{ flex: 1, height: 1, background: t.border }} />
      </div>

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
          width: "100%", padding: "14px 16px", borderRadius: 12, marginBottom: 10,
          border: `1px solid ${t.border}`, background: t.bg2,
          fontFamily: "'Outfit', sans-serif", fontSize: 14, color: t.text,
          outline: "none",
        }}
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSignIn()}
        style={{
          width: "100%", padding: "14px 16px", borderRadius: 12, marginBottom: 16,
          border: `1px solid ${t.border}`, background: t.bg2,
          fontFamily: "'Outfit', sans-serif", fontSize: 14, color: t.text,
          outline: "none",
        }}
      />

      {/* Error */}
      {error && (
        <div style={{ fontSize: 12, color: "#E24B4A", marginBottom: 12, textAlign: "center" }}>{error}</div>
      )}

      {/* Sign In Button */}
      <button onClick={handleSignIn} disabled={loading} style={{
        ...s.saveBtn, margin: 0, width: "100%",
        opacity: loading ? 0.6 : 1,
      }}>
        {loading ? "Signing in..." : "Sign In"}
      </button>

      {/* Sign Up Link */}
      <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: t.textMuted }}>
        Don't have an account?{" "}
        <span style={{ color: t.accent, cursor: "pointer", fontWeight: 500 }} onClick={() => navigate("SignUp")}>
          Sign Up
        </span>
      </div>

    </div>
  );
}