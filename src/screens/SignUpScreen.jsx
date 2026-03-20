import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SignUpScreen({ navigate, s, t }) {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) return setError("Please fill in all fields.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    setError("");
    const { error } = await signUp(email, password, name);
    if (error) setError(error.message);
    else setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ ...s.app, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "0 26px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>☕</div>
        <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 24, fontStyle: "italic", color: t.text, marginBottom: 10 }}>
          Check your email
        </div>
        <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.6, marginBottom: 32 }}>
          We sent a confirmation link to <strong style={{ color: t.text }}>{email}</strong>. Click it to activate your account.
        </div>
        <span style={{ color: t.accent, cursor: "pointer", fontSize: 13, fontWeight: 500 }} onClick={() => navigate("Login")}>
          Back to Sign In →
        </span>
      </div>
    );
  }

  return (
    <div style={{ ...s.app, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh", padding: "0 26px" }}>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={s.logo}>brew<em style={s.logoEm}>ly</em></div>
        <div style={s.tagline}>Create your account.</div>
      </div>

      {/* Name */}
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{
          width: "100%", padding: "14px 16px", borderRadius: 12, marginBottom: 10,
          border: `1px solid ${t.border}`, background: t.bg2,
          fontFamily: "'Outfit', sans-serif", fontSize: 14, color: t.text,
          outline: "none",
        }}
      />

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
        placeholder="Password (min 6 characters)"
        value={password}
        onChange={e => setPassword(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSignUp()}
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

      {/* Sign Up Button */}
      <button onClick={handleSignUp} disabled={loading} style={{
        ...s.saveBtn, margin: 0, width: "100%",
        opacity: loading ? 0.6 : 1,
      }}>
        {loading ? "Creating account..." : "Create Account"}
      </button>

      {/* Login Link */}
      <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: t.textMuted }}>
        Already have an account?{" "}
        <span style={{ color: t.accent, cursor: "pointer", fontWeight: 500 }} onClick={() => navigate("Login")}>
          Sign In
        </span>
      </div>

    </div>
  );
}
