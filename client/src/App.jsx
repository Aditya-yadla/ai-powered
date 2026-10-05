import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import NoteModal from './components/NoteModal';
import API from './services/api';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import NoteDetail from './pages/NoteDetail';
import SearchNotes from './pages/SearchNotes';
import AIStudyAssistant from './pages/AIStudyAssistant';
import SavedAIResults from './pages/SavedAIResults';

const AppContent = () => {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const handleOpenCreateModal = () => {
    setEditingNote(null);
    setIsNoteModalOpen(true);
  };

  const handleOpenEditModal = (note) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = async (formData) => {
    try {
      if (editingNote) {
        await API.put(`/notes/${editingNote._id}`, formData);
      } else {
        await API.post('/notes', formData);
      }
      setIsNoteModalOpen(false);
      setEditingNote(null);
      // Refresh window location or trigger re-fetch
      window.location.reload();
    } catch (err) {
      console.error('Error saving note:', err);
      alert('Error saving note: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onOpenCreateModal={handleOpenCreateModal} />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Student Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/*"
              element={
                <div className="flex-1 flex w-full">
                  <Sidebar />
                  <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <Routes>
                      <Route
                        path="dashboard"
                        element={<Dashboard onOpenCreateModal={handleOpenCreateModal} />}
                      />
                      <Route
                        path="notes"
                        element={
                          <Notes
                            onOpenCreateModal={handleOpenCreateModal}
                            onEditNote={handleOpenEditModal}
                          />
                        }
                      />
                      <Route
                        path="notes/:id"
                        element={<NoteDetail onEditNote={handleOpenEditModal} />}
                      />
                      <Route path="search" element={<SearchNotes />} />
                      <Route path="ai-assistant" element={<AIStudyAssistant />} />
                      <Route path="saved-ai" element={<SavedAIResults />} />
                    </Routes>
                  </main>
                </div>
              }
            />
          </Route>
        </Routes>
      </div>

      <Toast />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        initialData={editingNote}
      />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
