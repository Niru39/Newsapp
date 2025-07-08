import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../userAuth/firebase";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { logUserActivity } from "../userAuth/LogActivity";
import { useAuth } from "../userAuth/AuthContext"; // make sure you import useAuth

const defaultPreferences = {
  topics: [],
  customKeywords: [],
  notifications: {
    breakingNews: true,
    dailyDigest: false,
  },
};

const topicOptions = [
  "culture",
 "nature",
  "politics",
  "food",
  "corruption",
  "accidents",
];

const UserProfile = ({ onClose }) => {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [newKeyword, setNewKeyword] = useState("");
  const { currentUser } = useAuth(); // use currentUser here
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchPreferences = async () => {
      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPreferences(docSnap.data().preferences || defaultPreferences);
        }
      } catch (error) {
        if (error.code === "unavailable") {
          alert("Network unavailable");
        } else {
          console.error("Failed to fetch preferences:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [currentUser]);

  const toggleTopic = (topic) => {
    setPreferences((prev) => {
      const topics = prev.topics.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic];
      return { ...prev, topics };
    });
  };

  const toggleKeyword = (keyword) => {
    setPreferences((prev) => {
      const keywords = prev.customKeywords.includes(keyword)
        ? prev.customKeywords.filter((k) => k !== keyword)
        : [...prev.customKeywords, keyword];
      return { ...prev, customKeywords: keywords };
    });
  };

  const savePreferences = async () => {
    if (!currentUser) {
      alert("Please log in to save preferences.");
      return;
    }

    try {
      console.log("Saving preferences:", preferences);

      const writePromise = setDoc(
        doc(db, "users", currentUser.uid),
        { preferences },
        { merge: true }
      );

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore write timeout")), 5000)
      );

      await Promise.race([writePromise, timeoutPromise]);

      await logUserActivity(
        currentUser.uid,
        currentUser.displayName || "Unknown", 
        "Updated Preferences",                  
        { updatedPreferences: preferences },
        null,    
        false                                  
      );


      alert("Preferences saved!");
      navigate("/");
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save preferences. Try again.");
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="user-profile-container">
      <Link to="/" className="close-button" aria-label="Go home">
        ×
      </Link>

      <h2 className="profile-title">Your Preferences</h2>

      <section className="preferences-section">
        <h3 className="section-title">Topics</h3>
        <div className="topics-list">
          {topicOptions.map((topic) => (
            <label key={topic} className="topic-label">
              <input
                type="checkbox"
                checked={preferences.topics.includes(topic)}
                onChange={() => toggleTopic(topic)}
                className="checkbox-input"
              />
              {topic}
            </label>
          ))}
        </div>
      </section>

      <section className="preferences-section">
        <h3 className="section-title">Custom Keywords</h3>
        <div className="keyword-input-wrapper">
          <input
            type="text"
            placeholder="Add keyword"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newKeyword.trim()) {
                toggleKeyword(newKeyword.trim());
                setNewKeyword("");
              }
            }}
            className="keyword-input"
          />
          <button
            type="button"
            onClick={() => {
              if (newKeyword.trim()) {
                toggleKeyword(newKeyword.trim());
                setNewKeyword("");
              }
            }}
            className="add-keyword-btn"
          >
            Add
          </button>
        </div>
        <div className="keywords-list">
          {preferences.customKeywords.map((kw) => (
            <span
              key={kw}
              onClick={() => toggleKeyword(kw)}
              title="Click to remove"
              className="keyword-pill"
            >
              {kw} &times;
            </span>
          ))}
        </div>
      </section>

      <section className="preferences-section">
        <h3 className="section-title">Notifications</h3>
        <label className="notification-label">
          <input
            type="checkbox"
            checked={preferences.notifications.breakingNews}
            onChange={(e) =>
              setPreferences((p) => ({
                ...p,
                notifications: {
                  ...p.notifications,
                  breakingNews: e.target.checked,
                },
              }))
            }
            className="checkbox-input"
          />
          Breaking News
        </label>
        <br />
        <label className="notification-label">
          <input
            type="checkbox"
            checked={preferences.notifications.dailyDigest}
            onChange={(e) =>
              setPreferences((p) => ({
                ...p,
                notifications: {
                  ...p.notifications,
                  dailyDigest: e.target.checked,
                },
              }))
            }
            className="checkbox-input"
          />
          Daily Digest
        </label>
      </section>

      <button
        type="button"
        className="save-preferences-btn"
        onClick={savePreferences}
      >
        Save Preferences
      </button>
    </div>
  );
};

export default UserProfile;
