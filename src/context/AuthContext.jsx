
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
import app from '../firebase/config'; // Importujemy naszą skonfigurowaną aplikację

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Ważne: stan ładowania do sprawdzania sesji

  const auth = getAuth(app);

  // Funkcja do rejestracji nowego użytkownika
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Funkcja do logowania za pomocą emaila i hasła
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Funkcja do logowania za pomocą Google
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Funkcja do wylogowywania
  const logout = () => {
    return signOut(auth);
  };

  // Ten efekt to serce naszego systemu.
  // Firebase sam informuje nas o zmianie stanu zalogowania (nawet po odświeżeniu strony).
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false); // Kończymy ładowanie, gdy już wiemy czy jest użytkownik
    });

    return unsubscribe; // Czysta funkcja, która "odsubskrybuje" nas od słuchania
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout
  };

  // Nie renderujemy aplikacji, dopóki Firebase nie sprawdzi stanu logowania
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};