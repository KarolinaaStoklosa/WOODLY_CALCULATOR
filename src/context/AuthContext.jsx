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
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';
import app from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  // 1. DODAJEMY STAN DLA USTAWIEŃ FIRMY
  const [settings, setSettings] = useState(null); 

  const auth = getAuth(app);
  const db = getFirestore(app);

  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userRef = doc(db, 'users', user.uid);
    // Przy rejestracji tworzymy dokument z domyślnymi, pustymi ustawieniami
    await setDoc(userRef, {
      email: user.email,
      createdAt: new Date(),
      subscription: { status: 'inactive' },
      settings: {} // Inicjalizujemy pusty obiekt ustawień
    });
    return userCredential;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
        email: user.email,
        createdAt: new Date(),
    }, { merge: true });
    return userCredential;
  };
  
  const logout = () => signOut(auth);

  // 3. TWORZYMY FUNKCJĘ `updateSettings` (zamiast saveCompanyData)
  // Ta funkcja będzie pasować do Twojego komponentu CompanySettings.jsx
  const updateSettings = async (newSettings) => {
    if (currentUser) {
      // Optymistyczna aktualizacja UI
      setSettings(prev => ({ ...prev, ...newSettings }));
      const userRef = doc(db, 'users', currentUser.uid);
      try {
        await setDoc(userRef, { settings: newSettings }, { merge: true });
      } catch (error) {
        console.error("Błąd podczas zapisu ustawień firmy:", error);
      }
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      setLoading(true);
      setCurrentUser(user);
      
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            // 2. Wczytujemy ustawienia firmy i subskrypcji
            setSubscriptionStatus(data.subscription?.status || 'inactive');
            setSettings(data.settings || {}); // Wczytujemy ustawienia lub pusty obiekt
          }
          setLoading(false);
        }, (error) => {
          console.error("Błąd nasłuchiwania na profil użytkownika:", error);
          setLoading(false);
        });
        return () => unsubscribeProfile(); 
      } else {
        setSubscriptionStatus(null);
        setSettings(null); // Czyścimy ustawienia po wylogowaniu
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [auth, db]);

  const value = {
    currentUser,
    loading,
    subscriptionStatus,
    settings, // 4. DODAJEMY `settings` i `updateSettings` DO WARTOŚCI KONTEKSTU
    updateSettings,
    signup,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};