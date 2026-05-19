import { Link } from 'react-router-dom';

import {
  FiEdit,
  FiKey,
} from 'react-icons/fi';

import {
  useState,
  useEffect,
} from 'react';

export default function Header({
  noteKey,
  setNoteKey,
}) {

  const [inputKey, setInputKey] =
    useState(noteKey);

  // ====================================
  // KEEP INPUT IN SYNC
  // ====================================

  useEffect(() => {
    setInputKey(noteKey);
  }, [noteKey]);

  // ====================================
  // UPDATE ACTIVE KEY
  // ====================================

  const handleUpdateKey = () => {

    setNoteKey(inputKey);

    alert(
      'Encryption key updated'
    );
  };

  return (

    <header className="bg-white shadow-sm border-b border-gray-100">

      <div className="container mx-auto px-4 py-4">

        {/* ==================================== */}
        {/* TOP WRAPPER */}
        {/* ==================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          {/* ==================================== */}
          {/* BRAND */}
          {/* ==================================== */}

          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
          >

            <FiEdit className="text-blue-600 text-2xl" />

            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              CollabNotes
            </h1>

          </Link>

          {/* ==================================== */}
          {/* RIGHT SECTION */}
          {/* ==================================== */}

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full lg:w-auto">

            {/* ==================================== */}
            {/* NAV LINKS */}
            {/* ==================================== */}

            <nav className="flex items-center gap-4 text-sm md:text-base">

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

            </nav>

            {/* ==================================== */}
            {/* KEY SECTION */}
            {/* ==================================== */}

            <div className="flex items-center gap-2 w-full sm:w-auto">

              {/* INPUT */}

              <div className="relative flex-1 sm:flex-none">

                <FiKey
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) =>
                    setInputKey(e.target.value)
                  }
                  placeholder="Encryption Key"
                  className="
                    w-full
                    sm:w-56
                    md:w-64
                    pl-10
                    pr-3
                    py-2
                    border
                    border-gray-300
                    rounded-lg
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    text-sm
                  "
                />

              </div>

              {/* BUTTON */}

              <button
                onClick={handleUpdateKey}
                className="
                  shrink-0
                  bg-blue-600
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  text-sm
                  hover:bg-blue-700
                  transition
                "
              >
                Unlock
              </button>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}