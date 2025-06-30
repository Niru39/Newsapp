import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../userAuth/firebase";
import { useAuth } from "../userAuth/AuthContext";
import { logUserActivity, logAnalyticsEvent } from "../userAuth/firebase";  
import '../css/Poll.css';

const Poll = () => {
  const { currentUser, isAdmin } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin form state
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "polls"));
    setPolls(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  // Admin: handle adding option input
  const handleAddOption = () => setOptions([...options, ""]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Admin: create new poll
  const handleCreatePoll = async (e) => {
    e.preventDefault();
    if (!question.trim() || options.some(opt => !opt.trim())) {
      alert("Please fill question and all options.");
      return;
    }
    const formattedOptions = {};
    options.forEach(opt => (formattedOptions[opt] = 0));

    try {
      await addDoc(collection(db, "polls"), {
        question,
        options: formattedOptions,
        createdAt: serverTimestamp(),
        createdBy: currentUser.uid,
      });

      // Log admin create activity
      logUserActivity(currentUser.uid, "poll_create", { question, options: formattedOptions });
      logAnalyticsEvent("poll_create", { question, optionsCount: options.length });

      setQuestion("");
      setOptions(["", ""]);
      fetchPolls();
    } catch (error) {
      console.error("Failed to create poll:", error);
      alert("Failed to create poll.");
    }
  };

  // Admin: delete poll
  const handleDeletePoll = async (id) => {
    if (window.confirm("Delete this poll?")) {
      try {
        await deleteDoc(doc(db, "polls", id));

        // Log admin delete activity
        logUserActivity(currentUser.uid, "poll_delete", { pollId: id });
        logAnalyticsEvent("poll_delete", { pollId: id });

        fetchPolls();
      } catch (error) {
        console.error("Failed to delete poll:", error);
        alert("Failed to delete poll.");
      }
    }
  };

  // Normal User Poll voting component
  const PollVote = ({ poll, currentUser }) => {
    const [selected, setSelected] = useState("");
    const [options, setOptions] = useState(poll.options);

    const handleVote = async () => {
      if (!selected) return alert("Select an option first");

      if (!currentUser) {
        alert("Login required to vote.");
        return;
      }

      const updatedOptions = {
        ...options,
        [selected]: (options[selected] || 0) + 1
      };

      try {
        await updateDoc(doc(db, "polls", poll.id), { options: updatedOptions });
        setOptions(updatedOptions);
        setSelected("");

        // Log user activity to Firestore
        logUserActivity(currentUser.uid, "poll_vote", { pollId: poll.id, option: selected });

        // Log analytics event
        logAnalyticsEvent("poll_vote", { pollId: poll.id, option: selected });
      } catch (err) {
        console.error("Vote update failed:", err);
        alert("Failed to submit vote.");
      }
    };

    return (
      <div className="poll-vote">
        <h4>{poll.question}</h4>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="poll-select"
        >
          <option value="" disabled>
            Select an option
          </option>
          {Object.keys(options).map((opt) => (
            <option key={opt} value={opt}>
              {opt} ({options[opt]} votes)
            </option>
          ))}
        </select>
        <button className="poll-vote-button" onClick={handleVote}>
          Vote
        </button>
      </div>
    );
  };

  if (loading) return <p>Loading polls...</p>;

  return (
    <div className="polls-container">
      {isAdmin ? (
        <>
          <h2 className="polls-header">Manage Polls</h2>
          <form onSubmit={handleCreatePoll} className="polls-form">
            <input
              type="text"
              placeholder="Poll question"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              required
              className="poll-input"
            />
            {options.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option #${i + 1}`}
                value={opt}
                onChange={e => handleOptionChange(i, e.target.value)}
                required
                className="poll-input"
              />
            ))}
            <button type="button" onClick={handleAddOption} className="poll-add-option-button">
              Add Option
            </button>
            <button type="submit" className="poll-create-button">Create Poll</button>
          </form>

          <hr />

          <ul className="polls-list">
            {polls.map(poll => (
              <li key={poll.id} className="poll-list-item">
                <strong>{poll.question}</strong>
                <button
                  onClick={() => handleDeletePoll(poll.id)}
                  className="poll-delete-button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h2 className="polls-header">Vote on Polls</h2>
          {polls.length === 0 ? (
            <p>No polls available</p>
          ) : (
            polls.map(poll => <PollVote key={poll.id} poll={poll} currentUser={currentUser} />)
          )}
        </>
      )}
    </div>
  );
};

export default Poll;
