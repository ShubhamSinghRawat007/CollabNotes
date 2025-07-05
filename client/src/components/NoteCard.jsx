import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEdit2, FiClock } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

export default function NoteCard({ note }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition"
    >
      <Link to={`/note/${note._id}`} className="block h-full">
        <div className="p-5 h-full flex flex-col">
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <FiEdit2 className="text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-800 line-clamp-1">{note.title}</h3>
          </div>
          
          <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">
            {note.content || "No content yet..."}
          </p>
          
          <div className="flex items-center text-xs text-gray-400">
            <FiClock className="mr-1" />
            <span>
              {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}