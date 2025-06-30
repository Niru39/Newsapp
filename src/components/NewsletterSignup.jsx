import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../userAuth/firebase";
import { useAuth } from "../userAuth/AuthContext";
import "../css/NewsDetails.css";

const NewsletterSignup = () => {
  const { currentUser, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);

  // Fetch subscribers list for admin
  const fetchSubscribers = async () => {
    setLoadingSubscribers(true);
    try {
      const querySnapshot = await getDocs(collection(db, "newsletter"));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubscribers(list);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    }
    setLoadingSubscribers(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSubscribers();
    }
  }, [isAdmin]);

  // Handle newsletter signup for users
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setMsg("Please enter a valid email.");
      return;
    }

    try {
      await setDoc(doc(db, "newsletter", email.toLowerCase()), {
        subscribedAt: new Date(),
      });
      setMsg(`Thanks for signing up, ${email}!`);
      setEmail("");
      if (isAdmin) {
        fetchSubscribers(); // refresh list if admin subscribed
      }
    } catch (error) {
      console.error("Error saving email: ", error);
      setMsg("Oops! Something went wrong, please try again.");
    }
  };

  // Admin: delete subscriber
  const handleDelete = async (id) => {
    if (window.confirm("Remove this subscriber?")) {
      try {
        await deleteDoc(doc(db, "newsletter", id));
        fetchSubscribers();
      } catch (error) {
        console.error("Failed to delete subscriber:", error);
      }
    }
  };

  return (
    <section className="sidebar-section newsletter">
      <h3>Newsletter Signup</h3>
      <p>
        Stay informed with our weekly newsletter! Subscribe to get the latest news, updates,
        and exclusive insights delivered straight to your inbox.
      </p>

      {/* User signup form */}
      <form onSubmit={handleSubmit}>
        <input
          className="newsletter-input"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="newsletter-button">Subscribe</button>
      </form>
      {msg && <p className="newsletter-msg">{msg}</p>}

      {/* Admin subscriber list */}
      {isAdmin && (
        <>
          <hr />
          <h4>Subscriber List</h4>
          {loadingSubscribers ? (
            <p>Loading subscribers...</p>
          ) : subscribers.length === 0 ? (
            <p>No subscribers yet.</p>
          ) : (
            <ul className="subscriber-list">
              {subscribers.map(sub => (
                <li key={sub.id} className="subscriber-item">
                  <span>{sub.id}</span>
                  <button
                    className="subscriber-delete-button"
                    onClick={() => handleDelete(sub.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
};

export default NewsletterSignup;
