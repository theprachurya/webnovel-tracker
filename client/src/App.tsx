import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import NovelList from './components/NovelList';
import Login from './components/Login';
import AddNovel from './components/AddNovel';
import EditNovel from './components/EditNovel';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-sepia-background dark:bg-anilist-blue-dark text-sepia-text dark:text-anilist-white transition-colors duration-200">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <h1 className="text-4xl font-serif font-bold text-center mb-8 text-sepia-primary dark:text-anilist-white">
                Mugen's List
              </h1>
              <Routes>
                <Route path="/" element={<NovelList />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/add"
                  element={
                    <ProtectedRoute>
                      <AddNovel />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditNovel />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
