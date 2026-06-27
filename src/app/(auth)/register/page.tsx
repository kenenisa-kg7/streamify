"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Register coming soon — backend on Day 9!");
    }, 1000);
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#141414",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 24px",
      position: "relative"
    }}>

      {/* Background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('https://image.tmdb.org/t/p/original/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg')",
        backgroundSize: "cover", backgroundPosition: "center",
        filter: "brightness(0.2)"
      }} />

      {/* Logo */}
      <div style={{ position: "absolute", top: "24px", left: "48px", zIndex: 10 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <h1 style={{ color: "#e50914", fontSize: "28px", fontWeight: 900 }}>STREAMIFY</h1>
        </Link>
      </div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative", zIndex: 10,
          background: "rgba(0,0,0,0.85)",
          borderRadius: "8px",
          padding: "48px 40px",
          width: "100%",
          maxWidth: "450px",
        }}
      >
        <h2 style={{ color: "#ffffff", fontSize: "32px", fontWeight: 700, marginBottom: "28px" }}>
          Sign Up
        </h2>

        {/* Error message */}
        {error && (
          <div style={{
            background: "#e50914", color: "#ffffff",
            padding: "12px 16px", borderRadius: "4px",
            marginBottom: "20px", fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Name */}
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: "16px", background: "#333333",
              border: "1px solid #444444", borderRadius: "4px",
              color: "#ffffff", fontSize: "16px", outline: "none"
            }}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "16px", background: "#333333",
              border: "1px solid #444444", borderRadius: "4px",
              color: "#ffffff", fontSize: "16px", outline: "none"
            }}
          />

          {/* Password */}
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%", padding: "16px",
                background: "#333333", border: "1px solid #444444",
                borderRadius: "4px", color: "#ffffff",
                fontSize: "16px", outline: "none",
                boxSizing: "border-box"
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute", right: "16px", top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none",
                color: "#9ca3af", cursor: "pointer", fontSize: "13px"
              }}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>

          {/* Confirm Password */}
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              padding: "16px", background: "#333333",
              border: "1px solid #444444", borderRadius: "4px",
              color: "#ffffff", fontSize: "16px", outline: "none"
            }}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "16px", background: loading ? "#999" : "#e50914",
              color: "#ffffff", border: "none",
              borderRadius: "4px", fontSize: "16px",
              fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              marginTop: "8px"
            }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

        </form>

        {/* Login link */}
        <p style={{ color: "#9ca3af", fontSize: "15px", textAlign: "center", marginTop: "24px" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#ffffff", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>

        {/* Terms */}
        <p style={{ color: "#737373", fontSize: "13px", marginTop: "24px", lineHeight: 1.6 }}>
          By signing up you agree to our{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>Terms of Use</span>{" "}
          and{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>.
        </p>

      </motion.div>
    </main>
  );
}