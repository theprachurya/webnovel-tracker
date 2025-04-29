import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface NovelFormData {
  name: string;
  author: string;
  genre: string;
  status: string;
  score: number;
  comments: string;
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
  });
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [error, setError] = useState('');

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
          formDataToSend.append(key, value);
        }
      });

      await axios.post('http://localhost:5000/api/novels', formDataToSend, {
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
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-serif font-bold mb-6">Add New Novel</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium mb-1">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-medium mb-1">
              Genre
            </label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600"
              required
            >
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
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600"
              required
            >
              <option value="Plan to Read">Plan to Read</option>
              <option value="Reading">Reading</option>
              <option value="Completed">Completed</option>
              <option value="Dropped">Dropped</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          <div>
            <label htmlFor="score" className="block text-sm font-medium mb-1">
              Score
            </label>
            <input
              type="number"
              id="score"
              name="score"
              value={formData.score}
              onChange={handleInputChange}
              min="0"
              max="10"
              step="0.1"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium mb-1">
              Cover Image
            </label>
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600"
            />
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Cover preview"
                className="mt-2 w-32 h-48 object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        <div>
          <label htmlFor="comments" className="block text-sm font-medium mb-1">
            Comments
          </label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg"
          >
            Add Novel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNovel; 