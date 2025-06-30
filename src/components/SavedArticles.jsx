import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../userAuth/firebase';
import { useNavigate } from 'react-router-dom';
import '../css/SavedArticles.css'; // Add this for styling

const SavedArticles = () => {
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fallbackImage = "https://via.placeholder.com/400x200?text=No+Image";

  const fetchSaved = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login to view saved articles");
      navigate('/login');
      return;
    }

    try {
      const savedRef = collection(db, 'users', user.uid, 'savedArticles');
      const q = query(savedRef, orderBy('savedAt', 'desc'));
      const snapshot = await getDocs(q);
      const articles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSavedArticles(articles);
    } catch (error) {
      console.error("Failed to fetch saved articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const removeSaved = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'savedArticles', id));
      setSavedArticles(prev => prev.filter(article => article.id !== id));
    } catch (err) {
      console.error("Failed to remove article:", err);
      alert("Failed to remove article");
    }
  };

  if (loading) return <p className="loading-text">Loading saved articles...</p>;
  if (savedArticles.length === 0) return <p className="empty-text">You have no saved articles yet.</p>;

  return (
    <section className="saved-articles-section">
      <h2>Your Saved Articles</h2>
      <div className="saved-articles-grid">
        {savedArticles.map((article) => (
          <article key={article.id} className="saved-article-card">
            <img
              src={article.imageurl || fallbackImage}
              alt="saved"
              className="saved-article-img"
            />
            <div className="saved-article-info">
              <h3>{article.title}</h3>
              <p>{article.description?.slice(0, 100)}...</p>
              <p className="saved-date">
                <em>Saved on: {new Date(article.savedAt?.seconds * 1000).toLocaleString()}</em>
              </p>
              <div className="saved-article-actions">
                <button
                  className="view-btn"
                  onClick={() => navigate('/article', { state: { article } })}
                >
                  View in App
                </button>
                <button
                  className="remove-btn"
                  onClick={() => removeSaved(article.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default SavedArticles;
