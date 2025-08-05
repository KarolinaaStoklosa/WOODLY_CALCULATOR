import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase/config';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { DROPDOWN_DATA } from '../data/dropdowns';

const MaterialsContext = createContext();

export const useMaterials = () => useContext(MaterialsContext);

export const MaterialsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [materials, setMaterials] = useState(DROPDOWN_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Jeśli użytkownik nie jest zalogowany, używamy domyślnych danych i kończymy.
    if (!currentUser) {
      setMaterials(DROPDOWN_DATA);
      setLoading(false);
      return;
    }

    // Jeśli jest zalogowany, ustawiamy nasłuchiwanie na jego bibliotece materiałów.
    const docRef = doc(db, 'users', currentUser.uid, 'materials', 'library');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        // Jeśli biblioteka istnieje w chmurze, wczytujemy ją.
        setMaterials(docSnap.data());
      } else {
        // Jeśli nie istnieje (np. dla nowego użytkownika), tworzymy ją z domyślnych danych.
        console.log("Tworzenie domyślnej biblioteki materiałów dla użytkownika...");
        setDoc(docRef, DROPDOWN_DATA);
        setMaterials(DROPDOWN_DATA);
      }
      setLoading(false);
    }, (error) => {
      // Obsługa błędów, np. uprawnień
      console.error("Błąd wczytywania materiałów:", error);
      setLoading(false);
    });

    return () => unsubscribe(); // Ważne: czyścimy nasłuchiwanie po odmontowaniu komponentu
  }, [currentUser]);

  const updateMaterials = async (newMaterials) => {
    // Aktualizujemy stan lokalnie, aby interfejs był szybki
    setMaterials(newMaterials);
    // Jeśli użytkownik jest zalogowany, zapisujemy zmiany w chmurze
    if (currentUser) {
      const docRef = doc(db, 'users', currentUser.uid, 'materials', 'library');
      try {
        await setDoc(docRef, newMaterials);
      } catch (error) {
        console.error("Błąd zapisu materiałów:", error);
        // Można tu dodać logikę przywracania poprzedniego stanu w razie błędu
      }
    }
  };

  const value = {
    materials,
    loading,
    updateMaterials,
  };

  return (
    <MaterialsContext.Provider value={value}>
      {children}
    </MaterialsContext.Provider>
  );
};