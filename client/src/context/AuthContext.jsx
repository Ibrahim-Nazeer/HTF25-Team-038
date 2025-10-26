import React, { createContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  signInWithPopup, 
  GithubAuthProvider, 
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsRole, setNeedsRole] = useState(false);
  const [pendingUserData, setPendingUserData] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Build minimal profile from Firebase
        const profile = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        };

        try {
          const backendURL = import.meta.env.VITE_API_URL;
          
          if (!backendURL) {
            console.error('❌ VITE_API_URL is not configured!');
            alert('Backend URL not configured. Please check environment variables.');
            setUser(null);
            setLoading(false);
            return;
          }

          console.log('🔍 Checking user in backend:', backendURL);
          
          // Check if user exists in our DB
          const resp = await fetch(`${backendURL}/api/auth/user/${profile.id}`, {
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (resp.ok) {
            const dbUser = await resp.json();
            console.log('✅ User found in database:', dbUser.email);
            setUser({
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name,
              photoURL: dbUser.photoURL || profile.photoURL,
              role: dbUser.role
            });
            setNeedsRole(false);
            setPendingUserData(null);
          } else if (resp.status === 404) {
            // New user - ask for role before creating in DB
            console.log('👤 New user detected, requesting role selection');
            setPendingUserData(profile);
            setNeedsRole(true);
          } else {
            console.error('Failed to fetch user from backend:', resp.status);
            alert(`Backend error: ${resp.status}. Please try again.`);
            setUser(null);
          }
        } catch (error) {
          console.error('❌ Auth sync error:', error);
          alert(`Cannot connect to backend server. Please check if the server is running.\n\nError: ${error.message}`);
          setUser(null);
        }
      } else {
        setUser(null);
        setNeedsRole(false);
        setPendingUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const signInWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();
      provider.addScope('user:email');
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const setUserRole = async (role) => {
    if (!pendingUserData) throw new Error('No pending user data');

    try {
      const backendURL = import.meta.env.VITE_API_URL;
      
      if (!backendURL) {
        throw new Error('Backend URL not configured');
      }

      const body = {
        id: pendingUserData.id,
        email: pendingUserData.email,
        name: pendingUserData.name,
        role
      };

      console.log('📝 Creating user with role:', role);

      const resp = await fetch(`${backendURL}/api/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`Failed to create user: ${resp.status} ${errorText}`);
      }

      const created = await resp.json();
      console.log('✅ User created successfully:', created.email);
      
      setUser({
        id: created.id,
        email: created.email,
        name: created.name,
        photoURL: created.photoURL || pendingUserData.photoURL,
        role: created.role
      });
      setNeedsRole(false);
      setPendingUserData(null);
    } catch (error) {
      console.error('❌ setUserRole error:', error);
      alert(`Failed to create user account: ${error.message}`);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGithub,
    signInWithGoogle,
    needsRole,
    setUserRole,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;