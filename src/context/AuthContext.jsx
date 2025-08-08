import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase/config'; 
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Importuj funkcje Firestore

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 1. Dodaj stan dla danych firmy TUTAJ, w AuthContext
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // 2. Kiedy użytkownik jest zalogowany, wczytaj jego dane firmy
        const companyDocRef = doc(db, 'users', currentUser.uid);
        const companyDocSnap = await getDoc(companyDocRef);
        if (companyDocSnap.exists()) {
          setCompanyData(companyDocSnap.data().companyData);
          console.log('AuthProvider: Wczytano dane firmy.');
        } else {
          console.log('AuthProvider: Nie znaleziono danych firmy dla użytkownika.');
        }
      } else {
        // Czyść dane firmy po wylogowaniu
        setCompanyData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  
  // 3. Stwórz funkcję do zapisywania danych firmy
  const saveCompanyData = async (data) => {
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { companyData: data }, { merge: true });
        setCompanyData(data); // Zaktualizuj stan w aplikacji
        console.log('AuthProvider: Pomyślnie zapisano dane firmy.');
      } catch (error) {
        console.error("Błąd podczas zapisywania danych firmy:", error);
      }
    }
  };


  // 4. Udostępnij companyData i funkcję zapisu w wartości kontekstu
  const value = {
    user,
    companyData,
    saveCompanyData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};