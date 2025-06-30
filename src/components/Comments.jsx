import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { db, auth } from "../userAuth/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../userAuth/AuthContext";
import "../css/Comments.css";

const Comments = ({ articleId }) => {
  const { isAdmin } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "comments"), where("articleId", "==", articleId));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const handlePost = async () => {
    if (!newComment.trim()) return alert("Comment cannot be empty");
    if (!user) return alert("Please login to post a comment");

    try {
      await addDoc(collection(db, "comments"), {
        articleId,
        userId: user.uid,
        displayName: user.displayName || user.email,
        content: newComment.trim(),
        timestamp: serverTimestamp(),
      });
      setNewComment("");
      fetchComments();
    } catch (error) {
      alert("Failed to post comment.");
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteDoc(doc(db, "comments", commentId));
      fetchComments();
    } catch (error) {
      alert("Failed to delete comment.");
    }
  };

  return (
    <div className="comments-section">
      <h3 className="comments-title">Comments</h3>

      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <strong>{comment.displayName}:</strong> {comment.content}
            {isAdmin && (
              <button
                className="comment-delete-button"
                onClick={() => handleDelete(comment.id)}
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}

      {user ? (
        <div className="comment-form">
          <textarea
            className="comment-textarea"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="comment-post-button" onClick={handlePost}>
            Post
          </button>
        </div>
      ) : (
        <p className="comment-login-prompt">Please log in to post a comment.</p>
      )}
    </div>
  );
};

export default Comments;
