import React, { useEffect, useState } from 'react'; 
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';
import '../css/UserActivity.css';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination'

const userOptions = [
  { value: 'All', label: 'All' },
  { value: 'user_register', label: 'User Registered' },
  { value: 'user_login', label: 'User Logged In' },
  { value: 'user_social_login', label: 'Social Login' },
  { value: 'user_logout', label: 'User Logged Out' },
  { value: 'Viewed Article', label: 'Viewed Articles' },
  { value: 'Saved Article', label: 'Saved Articles' },
  {value:'Removed Saved Articles', label: 'Removed Saved Articles'},
  { value: 'Updated Preferences', label: 'Preferences Updated' },
  { value: 'Updated Profile', label: 'Profile Settings Updated' },
  { value: 'comment_post', label: 'Commented' },
  { value: 'poll_vote', label: 'Poll Votes' },
];

const adminOptions = [
  ...userOptions.slice(1),
  { value: 'delete_user', label: 'Deleted User' },
  { value: 'poll_create', label: 'Created Poll' },
  { value: 'poll_delete', label: 'Deleted Poll' },
  { value: 'made_admin', label: 'Made User Admin' },
  { value: 'revoked_admin', label: 'Revoked User Admin' },
];

// Actions to hide from regular users
const hiddenActions = ['user_register', 'user_login', 'user_social_login', 'user_logout'];

const getActionIcon = (type) => {
  if (!type) return '📝';
  switch (type) {
    case 'user_register':
      return '🆕';
    case 'user_login':
      return '🔐';
    case 'user_social_login':
      return '🌐';
    case 'user_logout':
      return '🚪';
    case 'Viewed Article':
      return '👀';
    case 'Saved Article':
      return '💾';
    case 'Updated Preferences':
      return '⚙️';
    case 'Updated Profile':
      return '👤';
    case 'comment_post':
      return '💬';
    case 'poll_vote':
      return '📊';
    case 'delete_user':
      return '🗑️';
    case 'poll_create':
      return '📋';
    case 'poll_delete':
      return '🗑️';
    case 'made_admin':
      return '🔑';
    case 'revoked_admin':
      return '🚫';
    case 'Removed Saved Articles':
      return '❌💾';
    default:
      return '📝';
  }
};

const getActionFromType = (typeStr) => {
  if (typeof typeStr !== 'string') return '';
  return typeStr.split(':')[0].trim();
};

const getLabelFromType = (type) => {
  const allOptions = [...userOptions, ...adminOptions];
  const baseType = getActionFromType(type);
  const match = allOptions.find((opt) => opt.value === baseType);
  return match ? match.label : baseType;
};

const formatDetails = (activity) => {
  if (activity.type === 'poll_vote' && activity.details) {
    const pollQuestion = activity.details.question || 'Unknown Poll';
    const option = activity.details.option || 'Unknown Option';
    return `Voted on poll:  ${pollQuestion} option: ${option}`;
  }

  if (typeof activity.details === 'object' && activity.details !== null) {
    if ('articleTitle' in activity.details) {
      return `Article: ${activity.details.articleTitle}`;
    }
    if ('updatedFields' in activity.details) {
      return `Updated fields: ${Object.keys(activity.details.updatedFields).join(', ')}`;
    }
    try {
      return JSON.stringify(activity.details);
    } catch {
      return 'Details unavailable';
    }
  }

  return typeof activity.details === 'string' ? activity.details : 'No details';
};

const UserActivity = () => {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);
  const [usersMap, setUsersMap] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  // Fetch user role (admin or not)
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!currentUser) {
        setIsAdmin(false);
        setRoleLoading(false);
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();
        const isAdminUser = userData?.role === 'admin' || userData?.isAdmin === true;
        setIsAdmin(isAdminUser);
      } catch (error) {
        console.error('Failed to fetch user role:', error);
        setIsAdmin(false);
      } finally {
        setRoleLoading(false);
      }
    };
    fetchUserRole();
  }, [currentUser]);

  // Fetch activities and filter hidden logs for non-admin users
  useEffect(() => {
    if (!currentUser) {
      setActivities([]);
      setLoading(false);
      return;
    }

    const fetchActivities = async () => {
      setLoading(true);
      try {
        let q;
        if (isAdmin) {
          q = query(collection(db, 'userActivities'), orderBy('timestamp', 'desc'));
        } else {
          q = query(
            collection(db, 'userActivities'),
            where('userId', '==', currentUser.uid),
            orderBy('timestamp', 'desc')
          );
        }

        const snapshot = await getDocs(q);
        const logs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        let filteredLogs = logs;
        if (!isAdmin) {
          filteredLogs = logs.filter(log => !hiddenActions.includes(getActionFromType(log.type)));
        }

        setActivities(filteredLogs);

        if (isAdmin) {
          const uniqueUserIds = [...new Set(logs.map((log) => log.userId))];
          const usersPromises = uniqueUserIds.map((uid) => getDoc(doc(db, 'users', uid)));
          const usersDocs = await Promise.all(usersPromises);
          const usersData = {};
          usersDocs.forEach((docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              usersData[docSnap.id] = data.email || data.name || docSnap.id;
            }
          });
          setUsersMap(usersData);
        }
      } catch (err) {
        console.error('Failed to fetch user activities:', err);
        setActivities([]);
      }
      setLoading(false);
    };

    fetchActivities();
  }, [currentUser, isAdmin]);

  // Reset filter if user selects a hidden action
  useEffect(() => {
    if (!isAdmin && hiddenActions.includes(filterType)) {
      setFilterType('All');
    }
  }, [filterType, isAdmin]);

  const handleDeleteLog = async (activity) => {
    const canDelete = isAdmin || activity.userId === currentUser.uid;
    if (!canDelete) {
      alert("You don't have permission to delete this log.");
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this log entry?');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'userActivities', activity.id));
      setActivities((prev) => prev.filter((a) => a.id !== activity.id));
      alert('Activity log deleted successfully!');
    } catch (error) {
      console.error('Failed to delete activity log:', error);
      alert('Failed to delete activity.');
    }
  };

  // Filter activities based on filterType
  const filteredActivities =
    filterType === 'All'
      ? activities
      : activities.filter((a) => getActionFromType(a.type) === filterType);

  // Pagination calculations
  const totalPages = Math.ceil(filteredActivities.length / logsPerPage);
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredActivities.slice(indexOfFirstLog, indexOfLastLog);

  const onPageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (!currentUser) return <p>Please log in to view your activity.</p>;
  if (loading || roleLoading) return <p>Loading activities...</p>;
  if (activities.length === 0) return <p>No activity found.</p>;

  return (
    <div className="user-activity">
      <Link to="/" className="close-button" aria-label="Go home">
        ×
      </Link>
      <h2>{isAdmin ? "All User's Activity Logs" : 'Your Activity Log'}</h2>

      <label htmlFor="activity-filter">Filter by action:</label>
      <select
        id="activity-filter"
        value={filterType}
        onChange={(e) => {
          setFilterType(e.target.value);
          setCurrentPage(1); // Reset to first page on filter change
        }}
        className="activity-filter"
      >
        {(isAdmin ? adminOptions : userOptions)
          .filter(opt => !(!isAdmin && hiddenActions.includes(opt.value)))
          .map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
      </select>

      <ul>
        {currentLogs.map((activity) => (
          <li
            key={activity.id}
            className={`activity-item ${activity.isAdminAction ? 'admin-action' : ''}`}
          >
            {isAdmin && (
              <p>
                <strong>User:</strong>{' '}
                {String(usersMap[activity.userId] || activity.userId)}
              </p>
            )}
            <p>
              <strong>Action:</strong> {getActionIcon(getActionFromType(activity.type))}{' '}
              {getLabelFromType(activity.type)}{' '}
              {activity.isAdminAction && <span>(Admin)</span>}
            </p>
            {activity.targetUserId && (
              <p>
                <strong>Target User:</strong>{' '}
                {String(usersMap[activity.targetUserId] || activity.targetUserId)}
              </p>
            )}
            <p>
              <strong>Details:</strong> {String(formatDetails(activity))}
            </p>
            <p>
              <strong>Time:</strong>{' '}
              {activity.timestamp?.toDate?.().toLocaleString() || 'Unknown'}
            </p>

            {(isAdmin || activity.userId === currentUser.uid) && (
              <button
                onClick={() => handleDeleteLog(activity)}
                className="delete-log-button"
              >
                🗑️ Delete
              </button>
            )}
          </li>
        ))}
      </ul>

    
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default UserActivity;
