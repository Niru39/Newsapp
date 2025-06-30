// src/userAuth/UserActivity.jsx
import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';
import '../css/UserActivity.css'; // optional: for styling

const UserActivity = () => {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!currentUser) return;

      const q = query(
        collection(db, 'userActivities'),
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc')
      );

      const snapshot = await getDocs(q);
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActivities(logs);
      setLoading(false);
    };

    fetchActivities();
  }, [currentUser]);

  if (!currentUser) return <p>Please log in to view your activity.</p>;
  if (loading) return <p>Loading your activity...</p>;
  if (activities.length === 0) return <p>No activity found.</p>;

  return (
    <div className="user-activity">
      <h2>Your Activity Log</h2>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id} className="activity-item">
            <p><strong>Action:</strong> {activity.activityType}</p>
            <p><strong>Details:</strong> {JSON.stringify(activity.details)}</p>
            <p><strong>Time:</strong> {activity.timestamp?.toDate().toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserActivity;
