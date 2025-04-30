import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';

interface NovelFormData {
  name: string;
  author: string;
  genre: string;
  status: string;
  score: number;
  comments: string;
  tags: string[];
  coverImage?: File;
}

const AddNovel: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NovelFormData>({
    name: '',
    author: '',
    genre: 'Fantasy',
    status: 'Plan to Read',
    score: 0,
    comments: '',
    tags: [],
  });
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [error, setError] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'score' ? parseFloat(value) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'tags') {
            formDataToSend.append(key, JSON.stringify(value));
          } else {
            formDataToSend.append(key, value);
          }
        }
      });

      await axios.post(`${config.apiUrl}/api/novels`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/');
    } catch (err) {
      setError('Error adding novel. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-anilist-blue-dark rounded-lg shadow-sepia dark:shadow-anilist">
      <h2 className="text-2xl font-serif font-bold mb-6 text-center text-sepia-text dark:text-anilist-white">Add New Novel</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sepia-text dark:text-anilist-white text-sm font-bold mb-2" htmlFor="name">
              Novel Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-sepia-text dark:text-anilist-white dark:bg-anilist-blue-dark leading-tight focus:outline-none focus:ring-2 focus:ring-sepia-primary focus:border-sepia-primary dark:focus:ring-anilist-blue dark:focus:border-anilist-blue"
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sepia-text dark:text-anilist-white text-sm font-bold mb-2" htmlFor="author">
              Author
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-sepia-text dark:text-anilist-white dark:bg-anilist-blue-dark leading-tight focus:outline-none focus:ring-2 focus:ring-sepia-primary focus:border-sepia-primary dark:focus:ring-anilist-blue dark:focus:border-anilist-blue"
              id="author"
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sepia-text dark:text-anilist-white text-sm font-bold mb-2" htmlFor="genre">
              Genre
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-sepia-text dark:text-anilist-white dark:bg-anilist-blue-dark leading-tight focus:outline-none focus:ring-2 focus:ring-sepia-primary focus:border-sepia-primary dark:focus:ring-anilist-blue dark:focus:border-anilist-blue"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              required
            >
              <option value="Fantasy">Fantasy</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Romance">Romance</option>
              <option value="Mystery">Mystery</option>
              <option value="Horror">Horror</option>
              <option value="Thriller">Thriller</option>
              <option value="Historical">Historical</option>
              <option value="Contemporary">Contemporary</option>
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Slice of Life">Slice of Life</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sepia-text dark:text-anilist-white text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-sepia-text dark:text-anilist-white dark:bg-anilist-blue-dark leading-tight focus:outline-none focus:ring-2 focus:ring-sepia-primary focus:border-sepia-primary dark:focus:ring-anilist-blue dark:focus:border-anilist-blue"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="Plan to Read">Plan to Read</option>
              <option value="Reading">Reading</option>
              <option value="Completed">Completed</option>
              <option value="Dropped">Dropped</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sepia-text dark:text-anilist-white text-sm font-bold mb-2" htmlFor="score">
            Score (0-10)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-sepia-text dark:text-anilist-white dark:bg-anilist-blue-dark leading-tight focus:outline-none focus:ring-2 focus:ring-sepia-primary focus:border-sepia-primary dark:focus:ring-anilist-blue dark:focus:border-anilist-blue"
            id="score"
            type="number"
            name="score"
            min="0"
            max="10"
            step="0.1"
            value={formData.score}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sepia-text dark:text-anilist-white text-sm font-bold mb-2" htmlFor="tags">
            Tags
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add a tag and press Enter"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-sepia-text dark:text-anilist-white dark:bg-anilist-blue-dark leading-tight focus:outline-none focus:ring-2 focus:ring-sepia-primary focus:border-sepia-primary dark:focus:ring-anilist-blue dark:focus:border-anilist-blue"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-sepia-primary text-white rounded hover:bg-sepia-primary/90 dark:bg-anilist-purple dark:hover:bg-anilist-purple/90 transition-all duration-200"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-sepia-secondary text-sepia-primary dark:bg-anilist-purple/20 dark:text-anilist-white rounded-full flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-sepia-primary dark:text-anilist-white hover:text-red-500 dark:hover:text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sepia-text dark:text-anilist-white text-sm font-bold mb-2" htmlFor="coverImage">
            Cover Image
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-sepia-text dark:text-anilist-white dark:bg-anilist-blue-dark leading-tight focus:outline-none focus:ring-2 focus:ring-sepia-primary focus:border-sepia-primary dark:focus:ring-anilist-blue dark:focus:border-anilist-blue"
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {coverPreview && (
            <div className="mt-2">
              <img src={coverPreview} alt="Cover preview" className="max-h-48 rounded shadow-sepia dark:shadow-anilist" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sepia-text dark:text-anilist-white text-sm font-bold mb-2" htmlFor="comments">
            Comments
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-sepia-text dark:text-anilist-white dark:bg-anilist-blue-dark leading-tight focus:outline-none focus:ring-2 focus:ring-sepia-primary focus:border-sepia-primary dark:focus:ring-anilist-blue dark:focus:border-anilist-blue"
            id="comments"
            name="comments"
            rows={4}
            value={formData.comments}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-sepia-primary hover:bg-sepia-primary/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-sepia-primary focus:ring-offset-2 dark:bg-anilist-purple dark:hover:bg-anilist-purple/90 dark:focus:ring-anilist-blue dark:focus:ring-offset-anilist-blue-dark transition-all duration-200"
            type="submit"
          >
            Add Novel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNovel; 