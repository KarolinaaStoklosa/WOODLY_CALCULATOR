import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import app from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  const auth = getAuth(app);
  const db = getFirestore(app);

  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      email: user.email,
      createdAt: new Date(),
      subscription: { status: 'inactive' }
    });
    return userCredential;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        createdAt: new Date(),
        subscription: { status: 'inactive' }
      });
    }
    return userCredential;
  };
  
  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists() && docSnap.data().subscription) {
            setSubscriptionStatus(docSnap.data().subscription.status);
          } else {
            setSubscriptionStatus('inactive');
          }
          setLoading(false);
        }, (error) => {
          console.error("Błąd nasłuchiwania na profil użytkownika:", error);
          setLoading(false);
        });
        return () => unsubscribeProfile();
      } else {
        setSubscriptionStatus(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, [auth, db]);

  const value = {
    currentUser, loading, subscriptionStatus,
    signup, login, loginWithGoogle, logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};