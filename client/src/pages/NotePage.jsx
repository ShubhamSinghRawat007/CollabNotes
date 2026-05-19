import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';
import { io } from 'socket.io-client';

import TextareaAutosize from 'react-textarea-autosize';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  FiClock,
  FiUsers,
  FiSave,
  FiTrash2,
} from 'react-icons/fi';

import UserAvatar from '../components/UserAvatar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function NotePage({
  noteKey
}) {

  const { id } = useParams();

  const navigate = useNavigate();

  const [note, setNote] = useState(null);

  const [content, setContent] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [lastUpdated, setLastUpdated] =
    useState('');

  const [activeUsers, setActiveUsers] =
    useState([]);

  const [isSaving, setIsSaving] =
    useState(false);

  const socketRef = useRef(null);

  // ====================================
  // ACTIVE KEY FROM NAVBAR
  // ====================================

  const passwordRef = useRef(noteKey);

  useEffect(() => {

    passwordRef.current = noteKey;

  }, [noteKey]);

  const BASE_URL =
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000';

  // ====================================
  // ENCODERS
  // ====================================

  const encoder = new TextEncoder();

  const decoder = new TextDecoder();

  // ====================================
  // HELPERS
  // ====================================

  function bufferToBase64(buffer) {

    return btoa(
      String.fromCharCode(
        ...new Uint8Array(buffer)
      )
    );
  }

  function base64ToBuffer(base64) {

    return Uint8Array.from(
      atob(base64),
      c => c.charCodeAt(0)
    );
  }

  // ====================================
  // KEY DERIVATION
  // ====================================

  async function deriveKey(
    password,
    salt
  ) {

    const passwordKey =
      await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
      );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 250000,
        hash: 'SHA-256',
      },
      passwordKey,
      {
        name: 'AES-GCM',
        length: 256,
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // ====================================
  // ENCRYPT
  // ====================================

  async function encryptText(
    text,
    password
  ) {

    const salt =
      crypto.getRandomValues(
        new Uint8Array(16)
      );

    const iv =
      crypto.getRandomValues(
        new Uint8Array(12)
      );

    const key =
      await deriveKey(password, salt);

    const encrypted =
      await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv,
        },
        key,
        encoder.encode(text)
      );

    const combined =
      new Uint8Array(
        salt.length +
        iv.length +
        encrypted.byteLength
      );

    combined.set(salt, 0);

    combined.set(iv, salt.length);

    combined.set(
      new Uint8Array(encrypted),
      salt.length + iv.length
    );

    return bufferToBase64(combined);
  }

  // ====================================
  // DECRYPT
  // ====================================

  async function decryptText(
    encryptedText,
    password
  ) {

    const data =
      base64ToBuffer(encryptedText);

    const salt = data.slice(0, 16);

    const iv = data.slice(16, 28);

    const encrypted = data.slice(28);

    const key =
      await deriveKey(password, salt);

    const decrypted =
      await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv,
        },
        key,
        encrypted
      );

    return decoder.decode(decrypted);
  }

  // ====================================
  // FETCH NOTE
  // ====================================

  useEffect(() => {

    const fetchNote = async () => {

      if (!passwordRef.current) {
        return;
      }

      try {

        const res =
          await axios.get(
            `${BASE_URL}/notes/${id}`
          );

        setNote(res.data);

        try {

          const decrypted =
            await decryptText(
              res.data.content,
              passwordRef.current
            );

          setContent(decrypted);

        } catch {

          setContent('');

          alert(
            'Wrong key for this note'
          );
        }

        setLastUpdated(
          new Date(
            res.data.updatedAt
          ).toLocaleString()
        );

        setLoading(false);

      } catch (err) {

        console.error(
          'Error fetching note:',
          err
        );

        navigate('/');
      }
    };

    fetchNote();

  }, [id, navigate, noteKey]);

  // ====================================
  // SOCKET CONNECTION
  // ====================================

  useEffect(() => {

    socketRef.current = io(BASE_URL);

    socketRef.current.emit(
      'join_note',
      id
    );

    socketRef.current.on(
      'note_updated',
      async (encryptedContent) => {

        try {

          const decrypted =
            await decryptText(
              encryptedContent,
              passwordRef.current
            );

          setContent(decrypted);

        } catch {

          console.log(
            'Could not decrypt update'
          );
        }

        setLastUpdated(
          new Date().toLocaleString()
        );
      }
    );

    socketRef.current.on(
      'active_users',
      (users) => {
        setActiveUsers(users);
      }
    );

    socketRef.current.on(
      'user_joined',
      (userId) => {

        setActiveUsers(prev => [

          ...new Set([
            ...prev,
            userId,
          ]),

        ]);
      }
    );

    socketRef.current.on(
      'user_left',
      (userId) => {

        setActiveUsers(prev =>
          prev.filter(
            uid => uid !== userId
          )
        );
      }
    );

    return () => {
      socketRef.current?.disconnect();
    };

  }, [id]);

  // ====================================
  // LIVE EDITING
  // ====================================

  const handleContentChange =
    async (e) => {

      const newContent =
        e.target.value;

      setContent(newContent);

      try {

        const encrypted =
          await encryptText(
            newContent,
            passwordRef.current
          );

        socketRef.current?.emit(
          'note_update',
          {
            noteId: id,
            content: encrypted,
          }
        );

      } catch (err) {

        console.error(
          'Encryption failed:',
          err
        );
      }
    };

  // ====================================
  // SAVE
  // ====================================

  const handleManualSave =
    async () => {

      if (!note) return;

      setIsSaving(true);

      try {

        const encrypted =
          await encryptText(
            content,
            passwordRef.current
          );

        await axios.put(
          `${BASE_URL}/notes/${id}`,
          {
            content: encrypted,
          }
        );

        setLastUpdated(
          new Date().toLocaleString()
        );

      } catch (err) {

        console.error(
          'Error saving note:',
          err
        );

      } finally {

        setIsSaving(false);
      }
    };

  // ====================================
  // DELETE
  // ====================================

  const handleDelete =
    async () => {

      const confirmDelete =
        window.confirm(
          'Are you sure you want to delete this note?'
        );

      if (!confirmDelete) return;

      try {

        await axios.delete(
          `${BASE_URL}/notes/${id}`
        );

        navigate('/');

      } catch (err) {

        console.error(
          'Error deleting note:',
          err
        );
      }
    };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (

    <div className="max-w-4xl mx-auto">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-md p-8 mb-6"
      >

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {note.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600">

          <div className="flex items-center">

            <FiClock className="mr-2" />

            <span>
              Last updated:
              {' '}
              {lastUpdated}
            </span>

          </div>

          <div className="flex items-center">

            <FiUsers className="mr-2" />

            <span>
              Collaborators:
            </span>

            <div className="flex ml-2 -space-x-2">

              <AnimatePresence>

                {activeUsers.map(
                  (userId) => (

                    <UserAvatar
                      key={userId}
                      id={userId}
                    />

                  )
                )}

              </AnimatePresence>

            </div>

          </div>

          <div className="ml-auto flex items-center gap-2">

            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className="flex items-center text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 transition disabled:opacity-50"
            >

              <FiSave className="mr-2" />

              {isSaving
                ? 'Saving...'
                : 'Save'}

            </button>

            <button
              onClick={handleDelete}
              className="flex items-center text-sm bg-red-50 text-red-600 px-3 py-1 rounded-md hover:bg-red-100 transition"
            >

              <FiTrash2 className="mr-2" />

              Delete

            </button>

          </div>

        </div>

        <TextareaAutosize
          value={content}
          onChange={handleContentChange}
          className="w-full p-6 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[400px] text-gray-700 leading-relaxed"
          placeholder="Start typing your encrypted note here..."
        />

      </motion.div>

    </div>
  );
}