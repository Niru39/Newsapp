import React, { useEffect, useState } from 'react';
import { db, auth } from '../userAuth/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import "../css/AdminPanel.css";
import { logUserActivity } from "../userAuth/LogActivity";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from Firestore
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersCol = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCol);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle admin status
  const toggleAdmin = async (userId, currentStatus) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isAdmin: !currentStatus,
      });
     await logUserActivity(
        auth.currentUser.uid,                      
        auth.currentUser.displayName || auth.currentUser.email || "Unknown", 
        currentStatus ? "revoked_admin" : "made_admin",
       { targetUserId: userId },                  
       true                                      
      );

      setUsers(users.map(user =>
        user.id === userId ? { ...user, isAdmin: !currentStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.id !== userId));
      await logUserActivity(
        auth.currentUser.uid,
        auth.currentUser.displayName || auth.currentUser.email || "Unknown",
        "delete_user",
        { targetUserId: userId },
        true
      );

    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className='admin-panel'>

      <h2>Admin Panel - Manage Users</h2>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr><td colSpan="4">No users found.</td></tr>
          )}
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name || 'No Name'}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => toggleAdmin(user.id, user.isAdmin)}>
                  {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                </button>
                <button className='delete-btn'
                  onClick={() => deleteUser(user.id)}
                
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
