import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { config } from '../config';

interface Novel {
  _id: string;
  name: string;
  author: string;
  genre: string;
  status: string;
  score: number;
  coverImage: string;
  comments: string;
  dateAdded: string;
  tags: string[];
  totalChapters: number;
  currentChapter: number;
}

type SortField = 'name' | 'score' | 'dateAdded' | 'author' | 'genre';
type SortOrder = 'asc' | 'desc';

const NovelList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortField, setSortField] = useState<SortField>('dateAdded');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { data: novels = [], isLoading, refetch } = useQuery<Novel[]>({
    queryKey: ['novels'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/api/novels`);
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Error fetching novels:', error);
        return [];
      }
    }
  });

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`${config.apiUrl}/api/novels/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refetch();
    } catch (error) {
      console.error('Error deleting novel:', error);
    }
  };

  const handleIncrementChapter = async (id: string, currentChapter: number, totalChapters?: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // If totalChapters is defined and currentChapter + 1 would exceed it, don't increment
    if (totalChapters && currentChapter + 1 > totalChapters) {
      return;
    }

    try {
      await axios.put(
        `${config.apiUrl}/api/novels/${id}`,
        { currentChapter: currentChapter + 1 },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      refetch();
    } catch (error) {
      console.error('Error incrementing chapter:', error);
    }
  };

  const handleUpdateChapters = async (id: string, currentChapter: number, totalChapters?: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const currentDisplay = totalChapters ? `${currentChapter}/${totalChapters}` : currentChapter.toString();
    const newChapters = prompt('Enter chapter count [current/total] or just current for ongoing:', currentDisplay);
    if (!newChapters) return;

    // Parse the input format
    const parts = newChapters.split('/');
    let newCurrent: number;
    let newTotal: number | undefined;

    if (parts.length === 2) {
      // Format: x/y
      newCurrent = parseInt(parts[0]);
      newTotal = parseInt(parts[1]);
    } else {
      // Format: x
      newCurrent = parseInt(parts[0]);
      newTotal = undefined;
    }

    if (isNaN(newCurrent) || newCurrent < 0 || (newTotal !== undefined && (isNaN(newTotal) || newTotal < 0))) {
      alert('Please enter valid chapter numbers');
      return;
    }

    if (newTotal !== undefined && newCurrent > newTotal) {
      alert(`Current chapters (${newCurrent}) cannot exceed total chapters (${newTotal})`);
      return;
    }

    try {
      await axios.put(
        `${config.apiUrl}/api/novels/${id}`,
        { 
          currentChapter: newCurrent,
          totalChapters: newTotal
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      refetch();
    } catch (error) {
      console.error('Error updating chapters:', error);
    }
  };

  const handleUpdateTotalChapters = async (id: string, currentTotalChapters?: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newTotalChapters = prompt('Enter total chapters:', currentTotalChapters?.toString() || '');
    if (!newTotalChapters) return;

    const newTotal = parseInt(newTotalChapters);
    if (isNaN(newTotal) || newTotal < 0) {
      alert('Please enter a valid chapter number');
      return;
    }

    try {
      await axios.put(
        `${config.apiUrl}/api/novels/${id}`,
        { totalChapters: newTotal },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      refetch();
    } catch (error) {
      console.error('Error updating total chapters:', error);
    }
  };

  const filteredNovels = useMemo(() => {
    return novels.filter((novel: Novel) => {
      const matchesSearch = novel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          novel.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = !selectedGenre || novel.genre === selectedGenre;
      const matchesStatus = !selectedStatus || novel.status === selectedStatus;
      return matchesSearch && matchesGenre && matchesStatus;
    });
  }, [novels, searchTerm, selectedGenre, selectedStatus]);

  const sortedNovels = useMemo(() => {
    return [...filteredNovels].sort((a, b) => {
      if (sortField === 'score') {
        return sortOrder === 'asc' ? a.score - b.score : b.score - a.score;
      }
      if (sortField === 'dateAdded') {
        return sortOrder === 'asc'
          ? new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
          : new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
      return sortOrder === 'asc'
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    });
  }, [filteredNovels, sortField, sortOrder]);

  const isLoggedIn = localStorage.getItem('token');

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in bg-sepia-background dark:bg-anilist-blue-dark min-h-screen p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search novels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sepia-primary focus:border-sepia-primary dark:focus:ring-anilist-blue dark:focus:border-anilist-blue dark:bg-anilist-blue-dark dark:border-anilist-purple transition-all duration-200 bg-white dark:text-anilist-white"
        />

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sepia-primary focus:border-sepia-primary dark:focus:ring-anilist-blue dark:focus:border-anilist-blue dark:bg-anilist-blue-dark dark:border-anilist-purple transition-all duration-200 bg-white dark:text-anilist-white"
        >
          <option value="">All Genres</option>
          <option value="Action">Action</option>
          <option value="Adventure">Adventure</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Horror">Horror</option>
          <option value="Mystery">Mystery</option>
          <option value="Romance">Romance</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Slice of Life">Slice of Life</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sepia-primary focus:border-sepia-primary dark:focus:ring-anilist-blue dark:focus:border-anilist-blue dark:bg-anilist-blue-dark dark:border-anilist-purple transition-all duration-200 bg-white dark:text-anilist-white"
        >
          <option value="">All Status</option>
          <option value="Plan to Read">Plan to Read</option>
          <option value="Reading">Reading</option>
          <option value="Completed">Completed</option>
          <option value="Dropped">Dropped</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      <div className="flex gap-4 items-center">
        <span className="text-sm font-medium text-sepia-text dark:text-anilist-white">Sort by:</span>
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sepia-primary focus:border-sepia-primary dark:focus:ring-anilist-blue dark:focus:border-anilist-blue dark:bg-anilist-blue-dark dark:border-anilist-purple transition-all duration-200 bg-white dark:text-anilist-white"
        >
          <option value="name">Name</option>
          <option value="author">Author</option>
          <option value="genre">Genre</option>
          <option value="score">Score</option>
          <option value="dateAdded">Date Added</option>
        </select>

        <button
          onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
          className="px-4 py-2 border rounded-lg hover:bg-sepia-primary hover:text-white dark:hover:bg-anilist-purple transition-all duration-200 bg-white dark:bg-anilist-blue-dark dark:text-anilist-white"
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedNovels.map((novel, index) => (
          <div
            key={novel._id}
            className="bg-white dark:bg-anilist-blue-dark rounded-lg shadow-sepia hover:shadow-sepia-hover dark:shadow-anilist dark:hover:shadow-anilist-hover overflow-hidden transition-all duration-300 animate-scale-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="aspect-w-3 aspect-h-4 relative group">
              <img
                src={novel.coverImage ? `${config.apiUrl}${novel.coverImage}` : '/placeholder-cover.jpg'}
                alt={novel.name}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-cover.jpg';
                  target.onerror = null;
                }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-anilist-purple/80 to-transparent dark:from-anilist-blue/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-serif font-bold text-sepia-text dark:text-anilist-white">{novel.name}</h3>
              <p className="text-sm text-sepia-primary dark:text-anilist-white/80">
                by {novel.author}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 text-xs rounded-full bg-sepia-secondary text-sepia-primary dark:bg-anilist-purple/20 dark:text-anilist-white">
                  {novel.genre}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-sepia-secondary text-sepia-primary dark:bg-anilist-purple/20 dark:text-anilist-white">
                  {novel.status}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-sepia-text dark:text-anilist-white">
                      Progress: {novel.currentChapter || 0}{novel.totalChapters > 0 ? `/${novel.totalChapters}` : ''} chapters
                    </span>
                    {isLoggedIn && (
                      <button
                        onClick={() => handleUpdateChapters(novel._id, novel.currentChapter || 0, novel.totalChapters)}
                        className="p-1 rounded-full hover:bg-sepia-primary/10 dark:hover:bg-anilist-purple/20 transition-colors duration-200"
                        title="Update chapter count"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-sepia-primary dark:text-anilist-purple"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {isLoggedIn && (!novel.totalChapters || (novel.currentChapter || 0) < novel.totalChapters) && (
                    <button
                      onClick={() => handleIncrementChapter(novel._id, novel.currentChapter || 0, novel.totalChapters)}
                      className="increment-button"
                      title="Increment chapter count"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-anilist-purple dark:text-anilist-purple-light"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: novel.totalChapters > 0
                        ? `${((novel.currentChapter || 0) / novel.totalChapters) * 100}%`
                        : '100%'
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-sepia-text dark:text-anilist-white">
                    Score: {novel.score.toFixed(1)}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => {
                      const starClass = i < Math.floor(novel.score / 2)
                        ? 'text-yellow-400'
                        : i === Math.floor(novel.score / 2) && novel.score % 2 >= 1
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-anilist-gray-dark';
                      
                      return (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${starClass}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      );
                    })}
                  </div>
                </div>
                {isLoggedIn && (
                  <div className="flex space-x-2">
                    <Link
                      to={`/edit/${novel._id}`}
                      className="p-2 rounded-full hover:bg-sepia-primary/10 dark:hover:bg-anilist-purple/20 transition-colors duration-200"
                      title="Edit novel"
                    >
                      <PencilIcon className="h-5 w-5 text-sepia-primary dark:text-anilist-purple" />
                    </Link>
                    <button
                      onClick={() => handleDelete(novel._id)}
                      className="p-2 rounded-full hover:bg-red-500/10 transition-colors duration-200"
                      title="Delete novel"
                    >
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NovelList;