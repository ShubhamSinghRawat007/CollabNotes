import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import TextareaAutosize from 'react-textarea-autosize';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiUsers, FiSave } from 'react-icons/fi';
import UserAvatar from '../components/UserAvatar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function NotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const socketRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/notes/${id}`);
        setNote(res.data);
        setContent(res.data.content);
        setLastUpdated(new Date(res.data.updatedAt).toLocaleString());
        setLoading(false);
      } catch (err) {
        console.error('Error fetching note:', err);
        navigate('/');
      }
    };

    fetchNote();

    // Connect to socket server
    socketRef.current = io(BASE_URL); // Use env URL

    // Join note room
    socketRef.current.emit('join_note', id);

    // Listen for live updates
    socketRef.current.on('note_updated', (updatedContent) => {
      setContent(updatedContent);
      setLastUpdated(new Date().toLocaleString());
    });

    socketRef.current.on('active_users', (users) => {
      setActiveUsers(users);
    });

    socketRef.current.on('user_joined', (userId) => {
      setActiveUsers(prev => [...new Set([...prev, userId])]);
    });

    socketRef.current.on('user_left', (userId) => {
      setActiveUsers(prev => prev.filter(uid => uid !== userId));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [id, navigate]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Emit live update to room
    socketRef.current?.emit('note_update', {
      noteId: id,
      content: newContent,
    });
  };

  const handleManualSave = async () => {
    if (!note) return;
    setIsSaving(true);
    try {
      await axios.put(`${BASE_URL}/notes/${id}`, { content });
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-md p-8 mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{note.title}</h1>

        <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600">
          <div className="flex items-center">
            <FiClock className="mr-2" />
            <span>Last updated: {lastUpdated}</span>
          </div>

          <div className="flex items-center">
            <FiUsers className="mr-2" />
            <span>Collaborators:</span>
            <div className="flex ml-2 -space-x-2">
              <AnimatePresence>
                {activeUsers.map(userId => (
                  <UserAvatar key={userId} id={userId} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          <button
            onClick={handleManualSave}
            disabled={isSaving}
            className="ml-auto flex items-center text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 transition disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Save
              </>
            )}
          </button>
        </div>

        <TextareaAutosize
          value={content}
          onChange={handleContentChange}
          className="w-full p-6 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[400px] text-gray-700 leading-relaxed"
          placeholder="Start typing your note here..."
        />
      </motion.div>
    </div>
  );
}
