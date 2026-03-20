import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as api from "../api";
import "./Auth.css";

export default function AuthPage() {
  const { saveToken } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const data = await api.login(form.email, form.password);
        saveToken(data.token);
      } else {
        await api.register(form.name, form.email, form.password);
        const data = await api.login(form.email, form.password);
        saveToken(data.token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="brand-mark">◆</span>
          <h1 className="brand-name">KanFlow</h1>
        </div>
        <p className="auth-tagline">Organize. Execute. Ship.</p>
        <div className="auth-lines">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="auth-line" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${mode === "register" ? "active" : ""}`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          <form onSubmit={submit} className="auth-form">
            {mode === "register" && (
              <div className="field">
                <label>Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handle}
                  placeholder="Your name"
                  required
                />
              </div>
            )}
            <div className="field">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handle}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handle}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="auth-error">⚠ {error}</p>}

            <button className="auth-submit" disabled={loading}>
              {loading ? "Working…" : mode === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
