import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <FiEdit className="text-blue-600 text-2xl" />
          <h1 className="text-xl font-bold text-gray-800">CollabNotes</h1>
        </Link>
        <nav className="flex space-x-4">
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition">
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
      </div>
    </header>
  );
}