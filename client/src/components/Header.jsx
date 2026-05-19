import { Link } from 'react-router-dom';
import { FiEdit, FiKey } from 'react-icons/fi';

import { useState } from 'react';

export default function Header({
  noteKey,
  setNoteKey,
}) {

  const [inputKey, setInputKey] =
    useState(noteKey);

  const handleUpdateKey = () => {

    setNoteKey(inputKey);

    alert(
      'Encryption key updated for next notes'
    );
  };

  return (

    <header className="bg-white shadow-sm">

      <div className="container mx-auto px-4 py-4 flex justify-between items-center">

        <Link
          to="/"
          className="flex items-center space-x-2"
        >

          <FiEdit className="text-blue-600 text-2xl" />

          <h1 className="text-xl font-bold text-gray-800">
            CollabNotes
          </h1>

        </Link>

        <nav className="flex items-center gap-4">

          <Link
            to="/"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Home
          </Link>

          <a
            href="https://github.com/ShubhamSinghRawat007/CollabNotes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            GitHub
          </a>

          {/* KEY INPUT */}

          <div className="flex items-center gap-2 ml-4">

            <div className="relative">

              <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="password"
                value={inputKey}
                onChange={(e) =>
                  setInputKey(e.target.value)
                }
                placeholder="Active Key"
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

            </div>

            <button
              onClick={handleUpdateKey}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              Unlock
            </button>

          </div>

        </nav>

      </div>

    </header>
  );
}