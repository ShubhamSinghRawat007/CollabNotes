import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import NoteCard from '../components/NoteCard';

export default function HomePage() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentNotes, setRecentNotes] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/notes`, { title });
      navigate(`/note/${res.data._id}`);
    } catch (err) {
      console.error('Error creating note:', err);
    } finally {
      setLoading(false);
    }
  };
  // Add this useEffect in HomePage.jsx
useEffect(() => {
  const fetchRecentNotes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/notes?limit=4`);
      setRecentNotes(res.data);
    } catch (err) {
      console.error('Error fetching recent notes:', err);
    }
  };

  fetchRecentNotes();
}, []);

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10 px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-8 mb-10"
    >
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-tight">
        Start a New Collaboration
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Note Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your note"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center font-medium shadow-md"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
                  1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating...
            </>
          ) : (
            'Create Note'
          )}
        </button>
      </form>
    </motion.div>

    {recentNotes.length > 0 && (
      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Notes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentNotes.map((note) => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      </div>
    )}
  </div>
);

}