import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-sepia-secondary dark:bg-anilist-blue shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-serif text-2xl font-bold text-sepia-text dark:text-anilist-white">
            Mugen's List
          </Link>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-sepia-primary/10 dark:hover:bg-anilist-purple/20 text-sepia-text dark:text-anilist-white"
            >
              {theme === 'light' ? (
                <MoonIcon className="h-6 w-6" />
              ) : (
                <SunIcon className="h-6 w-6" />
              )}
            </button>

            {isLoggedIn ? (
              <>
                <Link
                  to="/add"
                  className="px-4 py-2 rounded-lg bg-sepia-primary hover:bg-sepia-primary-dark dark:bg-anilist-blue dark:hover:bg-anilist-blue-light text-white transition-colors"
                >
                  Add Novel
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg border border-sepia-primary hover:bg-sepia-primary/10 dark:border-anilist-purple dark:hover:bg-anilist-purple/20 text-sepia-text dark:text-anilist-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg border border-sepia-primary hover:bg-sepia-primary/10 dark:border-anilist-purple dark:hover:bg-anilist-purple/20 text-sepia-text dark:text-anilist-white transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 