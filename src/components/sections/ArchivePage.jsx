import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { db } from '../../firebase/config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { Folder, Edit, Trash2, PlusCircle, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ArchivePage = ({ setActiveTab }) => { // Odbieramy funkcję do zmiany zakładek
  const { currentUser } = useAuth();
  const { loadProject, deleteProject, resetProject } = useProject();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const projectsCollectionRef = collection(db, 'users', currentUser.uid, 'projects');
    const q = query(projectsCollectionRef, orderBy('lastSaved', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projectsData = [];
      querySnapshot.forEach((doc) => {
        if (doc.id !== 'main') {
            projectsData.push({ id: doc.id, ...doc.data() });
        }
      });
      setProjects(projectsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleLoadProject = (projectId) => {
    loadProject(projectId);
    setActiveTab('szafki'); // Przełączamy na widok kalkulatora
  };
  
  const handleDeleteProject = (projectId, projectName) => {
    if (window.confirm(`Czy na pewno chcesz usunąć projekt "${projectName}"? Tej operacji nie można cofnąć.`)) {
      deleteProject(projectId);
    }
  };

  // ✅ NOWOŚĆ: Funkcja do tworzenia nowego projektu
  const handleNewProject = () => {
    resetProject();
    setActiveTab('projectSetup'); // Przekierowujemy do formularza danych projektu
  };

  if (loading) {
    return <div className="p-8 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Archiwum Projektów</h1>
        {/* ✅ NOWOŚĆ: Przycisk do tworzenia nowego projektu */}
        <button 
          onClick={handleNewProject}
          className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Utwórz Nowy Projekt
        </button>
      </div>
      
      {projects.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Folder className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Brak zapisanych projektów</h3>
            <p className="mt-1 text-sm text-gray-500">Gdy zapiszesz projekt w archiwum, pojawi się on tutaj.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {projects.map(project => (
            <li key={project.id} className="p-4 bg-white border rounded-lg shadow-sm flex items-center justify-between hover:border-blue-500 transition-colors">
              <div>
                <p className="font-semibold text-blue-600">{project.projectData?.projectName || 'Projekt bez nazwy'}</p>
                <p className="text-sm text-gray-500">
                  Ostatnia zmiana: {project.lastSaved?.toDate().toLocaleString('pl-PL') || 'Brak daty'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button title="Wczytaj projekt" onClick={() => handleLoadProject(project.id)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"><Edit className="w-5 h-5" /></button>
                <button title="Usuń projekt" onClick={() => handleDeleteProject(project.id, project.projectData?.projectName)} className="p-2 text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-5 h-5" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArchivePage;