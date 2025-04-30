import React, { useState } from 'react';
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

type SortField = 'name' | 'score' | 'dateAdded';
type SortOrder = 'asc' | 'desc';

const NovelList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortField, setSortField] = useState<SortField>('dateAdded');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [updatingNovel, setUpdatingNovel] = useState<string | null>(null);
  const [chapterUpdate, setChapterUpdate] = useState({ total: 0, current: 0 });

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

  const handleChapterUpdate = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const updateData: any = { currentChapter: chapterUpdate.current };
      if (chapterUpdate.total > 0) {
        updateData.totalChapters = chapterUpdate.total;
      }

      await axios.put(
        `${config.apiUrl}/api/novels/${id}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUpdatingNovel(null);
      refetch();
    } catch (error) {
      console.error('Error updating chapters:', error);
    }
  };

  const handleIncrementChapter = async (id: string, currentChapter: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

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

  const filteredNovels = Array.isArray(novels) ? novels.filter((novel: Novel) => {
    const matchesSearch = novel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         novel.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || novel.genre === selectedGenre;
    const matchesStatus = !selectedStatus || novel.status === selectedStatus;
    return matchesSearch && matchesGenre && matchesStatus;
  }) : [];

  const sortedNovels = [...filteredNovels].sort((a, b) => {
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
                  console.error('Image load error:', e);
                  e.currentTarget.src = '/placeholder-cover.jpg';
                  e.currentTarget.onerror = null; // Prevent infinite loop
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sepia-primary/80 to-transparent dark:from-anilist-blue/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-serif font-bold text-sepia-text dark:text-anilist-white">{novel.name}</h3>
              <p className="text-sm text-sepia-primary dark:text-anilist-white/80">
                by {novel.author}
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 text-xs rounded-full bg-sepia-secondary text-sepia-primary dark:bg-anilist-purple/20 dark:text-anilist-white">
                  {novel.genre}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-sepia-secondary text-sepia-primary dark:bg-anilist-purple/20 dark:text-anilist-white">
                  {novel.status}
                </span>
              </div>
              {(novel.totalChapters > 0 || novel.currentChapter > 0) && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-sepia-primary dark:text-anilist-white/80">
                    <span>Chapter Progress</span>
                    <div className="flex items-center gap-2">
                      <span>
                        {novel.currentChapter}
                        {novel.totalChapters > 0 ? ` / ${novel.totalChapters}` : ''}
                      </span>
                      {isLoggedIn && (
                        <button
                          onClick={() => handleIncrementChapter(novel._id, novel.currentChapter)}
                          className="p-1 rounded-full hover:bg-sepia-secondary text-sepia-primary dark:hover:bg-anilist-purple/20 dark:text-anilist-white transition-all duration-200 animate-bounce-in"
                          title="Increment chapter"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  {novel.totalChapters > 0 && (
                    <div className="w-full bg-sepia-secondary/50 rounded-full h-2 mt-1">
                      <div
                        className="bg-sepia-primary dark:bg-anilist-blue h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(novel.currentChapter / novel.totalChapters) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-sepia-primary dark:text-anilist-white">
                  {novel.score.toFixed(1)}
                </span>
                {isLoggedIn && (
                  <div className="flex gap-2">
                    {updatingNovel === novel._id ? (
                      <div className="flex gap-2 items-center animate-slide-up">
                        <input
                          type="number"
                          value={chapterUpdate.current}
                          onChange={(e) => setChapterUpdate(prev => ({ ...prev, current: parseInt(e.target.value) }))}
                          className="w-16 px-2 py-1 border rounded focus:ring-2 focus:ring-sepia-primary focus:border-sepia-primary dark:focus:ring-anilist-blue dark:focus:border-anilist-blue dark:bg-anilist-blue-dark dark:border-anilist-purple dark:text-anilist-white"
                          min="0"
                          max={chapterUpdate.total || undefined}
                        />
                        <span>/</span>
                        <input
                          type="number"
                          value={chapterUpdate.total || ''}
                          onChange={(e) => setChapterUpdate(prev => ({ ...prev, total: e.target.value ? parseInt(e.target.value) : 0 }))}
                          className="w-16 px-2 py-1 border rounded focus:ring-2 focus:ring-sepia-primary focus:border-sepia-primary dark:focus:ring-anilist-blue dark:focus:border-anilist-blue dark:bg-anilist-blue-dark dark:border-anilist-purple dark:text-anilist-white"
                          min="0"
                          placeholder="Ongoing"
                        />
                        <button
                          onClick={() => handleChapterUpdate(novel._id)}
                          className="px-2 py-1 bg-sepia-primary text-white rounded hover:bg-sepia-primary-dark dark:bg-anilist-blue dark:hover:bg-anilist-blue-light transition-all duration-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setUpdatingNovel(null)}
                          className="px-2 py-1 border rounded hover:bg-sepia-secondary/50 dark:hover:bg-anilist-purple/10 transition-all duration-200 dark:text-anilist-white"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setUpdatingNovel(novel._id);
                            setChapterUpdate({
                              total: novel.totalChapters,
                              current: novel.currentChapter
                            });
                          }}
                          className="p-2 rounded-lg hover:bg-sepia-secondary/50 dark:hover:bg-anilist-purple/20 transition-all duration-200"
                        >
                          <span className="text-sm text-sepia-primary dark:text-anilist-white">Update Chapters</span>
                        </button>
                        <Link
                          to={`/edit/${novel._id}`}
                          className="p-2 rounded-lg hover:bg-sepia-secondary/50 dark:hover:bg-anilist-purple/20 transition-all duration-200"
                        >
                          <PencilIcon className="h-5 w-5 text-sepia-primary dark:text-anilist-white" />
                        </Link>
                        <button
                          onClick={() => handleDelete(novel._id)}
                          className="p-2 rounded-lg hover:bg-sepia-accent/50 dark:hover:bg-anilist-pink/20 transition-all duration-200 text-sepia-primary-dark dark:text-anilist-pink"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              {novel.comments && (
                <p className="text-sm text-sepia-primary dark:text-anilist-white/80 mt-2">
                  {novel.comments}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NovelList; 