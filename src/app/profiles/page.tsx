"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import {
  fetchProfiles,
  createProfile,
  saveActiveProfile,
  Profile,
} from "@/lib/profiles";

const AVATAR_OPTIONS = ["👤", "🎬", "🍿", "👾", "🐱", "🦁", "🚀", "🎮"];

export default function ProfilesPage() {
  const router = useRouter();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add-profile form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState(AVATAR_OPTIONS[0]);
  const [creating, setCreating] = useState(false);

  // Auth guard + initial load
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    fetchProfiles()
      .then((data) => setProfiles(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load profiles"))
      .finally(() => setLoading(false));
  }, [router]);

  function handleSelectProfile(profile: Profile) {
    saveActiveProfile(profile);
    router.push("/browse");
  }

  async function handleCreateProfile(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!newName.trim()) {
      setError("Profile name is required.");
      return;
    }

    setCreating(true);
    try {
      const profile = await createProfile(newName.trim(), newAvatar);
      setProfiles((prev) => [...prev, profile]);
      setShowAddForm(false);
      setNewName("");
      setNewAvatar(AVATAR_OPTIONS[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create profile");
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <p style={{ color: "#ffffff", fontSize: "18px" }}>Loading profiles...</p>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <h1 style={{ color: "#ffffff", fontSize: "36px", fontWeight: 700, marginBottom: "8px" }}>
        Who&apos;s watching?
      </h1>

      {error && (
        <div
          style={{
            background: "#e50914",
            color: "#ffffff",
            padding: "10px 16px",
            borderRadius: "4px",
            marginTop: "16px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          justifyContent: "center",
          marginTop: "40px",
          maxWidth: "700px",
        }}
      >
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => handleSelectProfile(profile)}
            style={profileCardStyle}
          >
            <div style={avatarCircleStyle}>{profile.avatar}</div>
            <span style={{ color: "#e5e5e5", fontSize: "16px" }}>{profile.name}</span>
          </button>
        ))}

        {/* Add profile tile — only show if under the 5-profile limit */}
        {profiles.length < 5 && (
          <button onClick={() => setShowAddForm(true)} style={profileCardStyle}>
            <div
              style={{
                ...avatarCircleStyle,
                background: "#222",
                border: "2px dashed #555",
                fontSize: "32px",
                color: "#888",
              }}
            >
              +
            </div>
            <span style={{ color: "#888", fontSize: "16px" }}>Add Profile</span>
          </button>
        )}
      </div>

      {/* Add profile form, shown as a simple inline panel */}
      {showAddForm && (
        <form
          onSubmit={handleCreateProfile}
          style={{
            marginTop: "40px",
            background: "rgba(0,0,0,0.85)",
            padding: "32px",
            borderRadius: "8px",
            width: "100%",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h2 style={{ color: "#fff", fontSize: "20px", marginBottom: "4px" }}>New Profile</h2>

          <input
            type="text"
            placeholder="Profile name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{
              padding: "14px",
              background: "#333",
              border: "1px solid #444",
              borderRadius: "4px",
              color: "#fff",
              fontSize: "15px",
              outline: "none",
            }}
          />

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {AVATAR_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setNewAvatar(emoji)}
                style={{
                  fontSize: "24px",
                  padding: "8px",
                  borderRadius: "6px",
                  background: newAvatar === emoji ? "#e50914" : "#333",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              type="submit"
              disabled={creating}
              style={{
                flex: 1,
                padding: "12px",
                background: creating ? "#999" : "#e50914",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontWeight: 700,
                cursor: creating ? "not-allowed" : "pointer",
              }}
            >
              {creating ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              style={{
                flex: 1,
                padding: "12px",
                background: "transparent",
                color: "#e5e5e5",
                border: "1px solid #444",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#141414",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 24px",
};

const profileCardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
};

const avatarCircleStyle: React.CSSProperties = {
  width: "100px",
  height: "100px",
  borderRadius: "8px",
  background: "linear-gradient(135deg, #e50914, #a78bfa)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "44px",
};