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
import { logUserActivity } from "../userAuth/LogActivity";

const Comments = ({ articleId }) => {
  const { isAdmin, username, currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [loading, setLoading] = useState(true);



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
    if (!currentUser) return alert("Please login to post a comment");

    try {
      await addDoc(collection(db, "comments"), {
        articleId,
        userId: currentUser.uid,
        displayName: currentUser.displayName || currentUser.email,
        content: newComment.trim(),
        timestamp: serverTimestamp(),
      });
      alert('Comment posted successfully.')
      await logUserActivity(
        currentUser.uid,
        currentUser.displayName || currentUser.email || "Unknown",
        "comment_post",
        { articleId },
        newComment.trim()
      );


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
      alert("Comment deleted sucessfully.");
      await logUserActivity(
        currentUser.uid,
        username || currentUser.displayName || currentUser.email || "Unknown",
        "comment_delete",
        {
          articleId,
          commentId,
        },
        isAdmin
      );
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

      {currentUser ? (
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
