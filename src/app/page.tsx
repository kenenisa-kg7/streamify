"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    icon: "🎬",
    title: "Unlimited Movies & Shows",
    description: "Stream thousands of movies and TV shows in HD quality anytime, anywhere."
  },
  {
    icon: "📱",
    title: "Watch on Any Device",
    description: "Enjoy Streamify on your phone, tablet, laptop, and TV seamlessly."
  },
  {
    icon: "🤖",
    title: "AI Recommendations",
    description: "Get personalized movie suggestions based on your mood and watch history."
  },
  {
    icon: "👨‍👩‍👧",
    title: "Multiple Profiles",
    description: "Create separate profiles for everyone in your household."
  },
];

export default function LandingPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#141414", overflowX: "hidden" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 48px",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)"
      }}>
        <h1 style={{ color: "#e50914", fontSize: "28px", fontWeight: 900, letterSpacing: "0.05em" }}>
          STREAMIFY
        </h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/login" style={{
            padding: "8px 20px", color: "#ffffff",
            textDecoration: "none", fontSize: "14px", fontWeight: 500
          }}>
            Sign In
          </Link>
          <Link href="/register" style={{
            padding: "8px 20px", background: "#e50914",
            color: "#ffffff", textDecoration: "none",
            borderRadius: "4px", fontSize: "14px", fontWeight: 600
          }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "0 24px", position: "relative"
      }}>
        {/* Background */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://image.tmdb.org/t/p/original/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg')",
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.3)"
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: "800px" }}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: "64px", fontWeight: 900, color: "#ffffff", lineHeight: 1.1, marginBottom: "24px" }}
          >
            Unlimited Movies,{" "}
            <span style={{ color: "#e50914" }}>TV Shows</span>{" "}
            and More.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: "22px", color: "#e5e5e5", marginBottom: "40px", lineHeight: 1.6 }}
          >
            Watch anywhere. Cancel anytime. Powered by AI recommendations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link href="/register" style={{
              padding: "16px 40px", background: "#e50914",
              color: "#ffffff", textDecoration: "none",
              borderRadius: "4px", fontSize: "18px", fontWeight: 700
            }}>
              Get Started
            </Link>
            <Link href="/login" style={{
              padding: "16px 40px", background: "rgba(255,255,255,0.2)",
              color: "#ffffff", textDecoration: "none",
              borderRadius: "4px", fontSize: "18px", fontWeight: 700,
              backdropFilter: "blur(10px)"
            }}>
              Sign In
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{
            position: "absolute", bottom: "32px",
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: "8px", color: "#9ca3af"
          }}
        >
          <span style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase" }}>Scroll</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: "96px 48px", background: "#141414" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "64px" }}
          >
            <h2 style={{ fontSize: "40px", fontWeight: 800, color: "#ffffff", marginBottom: "16px" }}>
              Why Choose Streamify?
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "18px" }}>
              Everything you need for the perfect streaming experience
            </p>
          </motion.div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px"
          }}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                style={{
                  padding: "32px 24px",
                  borderRadius: "12px",
                  background: "#1f1f1f",
                  border: "1px solid #2a2a2a",
                  display: "flex", flexDirection: "column", gap: "16px"
                }}
              >
                <span style={{ fontSize: "40px" }}>{feature.icon}</span>
                <h3 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700 }}>
                  {feature.title}
                </h3>
                <p style={{ color: "#9ca3af", fontSize: "15px", lineHeight: 1.7 }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: "96px 48px", textAlign: "center",
        background: "linear-gradient(to bottom, #141414, #1a0000)"
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: "48px", fontWeight: 900, color: "#ffffff", marginBottom: "16px" }}>
            Ready to Watch?
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "18px", marginBottom: "40px" }}>
            Join millions of viewers streaming today.
          </p>
          <Link href="/register" style={{
            padding: "18px 48px", background: "#e50914",
            color: "#ffffff", textDecoration: "none",
            borderRadius: "4px", fontSize: "20px", fontWeight: 700
          }}>
            Start Watching Now
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "40px 48px",
        borderTop: "1px solid #2a2a2a",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "16px"
      }}>
        <h2 style={{ color: "#e50914", fontSize: "20px", fontWeight: 900 }}>STREAMIFY</h2>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>
          © {new Date().getFullYear()} Streamify. Built by Kenenisa Gemechu.
        </p>
      </footer>

    </main>
  );
}
