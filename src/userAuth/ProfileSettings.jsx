import React, { useState, useEffect } from "react";
import { useAuth } from "../userAuth/AuthContext";
import { updateProfile } from "firebase/auth";
import { auth, storage, db } from "../userAuth/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import "../css/ProfileSettings.css";

// 🔧 Helper: Upload with timeout
const uploadWithTimeout = (ref, file, timeout = 30000) => {
  return Promise.race([
    uploadBytes(ref, file),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Upload timeout exceeded")), timeout)
    ),
  ]);
};

const ProfileSettings = () => {
  const { currentUser, isAdmin } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState("");

  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.displayName || "");
      setEmail(currentUser.email || "");
      setProfileImageURL(currentUser.photoURL || "");

      const fetchUserProfile = async () => {
        const userDoc = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBio(data.bio || "");
          setLocation(data.location || "");
        }
      };

      fetchUserProfile();
    }
  }, [currentUser]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
      setProfileImageURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      let photoURL;

      // 🔐 Check file size before upload
      if (profileImageFile) {
        if (profileImageFile.size > 5 * 1024 * 1024) {
          alert("Image too large. Please select an image under 5MB.");
          return;
        }

        const imageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);

        // ⚠️ Upload with timeout
        await uploadWithTimeout(imageRef, profileImageFile);
        photoURL = await getDownloadURL(imageRef);
      }

      const updateData = {};
      if (fullName.trim() !== "") updateData.displayName = fullName.trim();
      if (photoURL) updateData.photoURL = photoURL;

      if (Object.keys(updateData).length > 0) {
        await updateProfile(auth.currentUser, updateData);
      }

      // 📌 Save to Firestore
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          bio: bio.trim(),
          location: location.trim(),
        },
        { merge: true }
      );

      alert("✅ Profile updated successfully!");
    } catch (error) {
      alert("❌ Failed to update profile: " + error.message);
    }
  };

  return (
    <div className="profile-settings-container">
      <Link to="/" className="close-button" aria-label="Go home">×</Link>

      <h2>Profile Settings</h2>
      <form onSubmit={handleSave} className="profile-form">

        <label>
          Profile Image
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {profileImageURL && (
          <img src={profileImageURL} alt="Profile Preview" />
        )}

        <label>
          Full Name
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>

        <label>
          Email
          <input type="email" value={email} readOnly />
        </label>

        <label>
          Bio
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a bit about yourself"
          />
        </label>

        <label>
          Location
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, Country"
          />
        </label>

        <button type="submit" className="btn-save">Save Changes</button>
      </form>

    
    </div>
  );
};

export default ProfileSettings;
