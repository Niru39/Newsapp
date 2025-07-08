import React, { useState } from 'react';
import { auth, db } from '../userAuth/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { logUserActivity } from '../userAuth/LogActivity';
import '../css/Auth.css';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const AuthForm = ({ onClose }) => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: name });

        await setDoc(doc(db, 'users', user.uid), {
          name,
          email,
          isAdmin: false,
          createdAt: new Date(),
        });

        await logUserActivity(
          user.uid,
          name || user.email,
          "user_register",
          { name, email },
          null,
          false
        );


      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await logUserActivity(
          user.uid,
          user.displayName || user.email,
          "user_login",
          {username: username},
          null,
          false
        );

      }

      window.location.href = '/';
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        name: user.displayName || '',
        email: user.email,
        isAdmin: false,
        createdAt: new Date(),
      }, { merge: true });

      await logUserActivity(
        user.uid,
        user.displayName || user.email,
        "user_social_login",
        {
          provider: provider.providerId,
          email: user.email,
          name: user.displayName
        },
        null,
        false
      );


      window.location.href = '/';
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };



  return (
    <div className="auth-page">
      <div className="auth-form-container">
        {onClose && (
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close authentication form"
            type="button"
          >
            x
          </button>
        )}

        <h2>{mode === 'login' ? 'Log In' : 'Create New Account'}</h2>
        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? (mode === 'login' ? 'Logging in...' : 'Registering...') : (mode === 'login' ? 'Log In' : 'Register')}
          </button>
        </form>

        <div className="social-login-container">
          <p>Or {mode === 'login' ? 'log in' : 'register'} with:</p>
          <button
            className="social-btn google"
            onClick={() => handleSocialLogin(googleProvider)}
            disabled={loading}
            aria-label="Login with Google"
          >
            Google
          </button>
          <button
            className="social-btn facebook"
            onClick={() => handleSocialLogin(facebookProvider)}
            disabled={loading}
            aria-label="Login with Facebook"
          >
            Facebook
          </button>
        </div>

        <p className="auth-footer">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <span className="auth-toggle-link" onClick={() => setMode('register')}>
                Create one
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span className="auth-toggle-link" onClick={() => setMode('login')}>
                Log In
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
