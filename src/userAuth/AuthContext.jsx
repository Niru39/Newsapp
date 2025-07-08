import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../userAuth/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Create local states here, NOT by destructuring useAuth()
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setCurrentUser(user);
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setIsAdmin(data.isAdmin === true);
            setUsername(data.name || data.username || null);
          } else {
            setIsAdmin(false);
            setUsername(null);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setIsAdmin(false);
          setUsername(null);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
        setUsername(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, username, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
