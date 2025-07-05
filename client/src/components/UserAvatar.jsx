import { motion } from 'framer-motion';

export default function UserAvatar({ id }) {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
  ];
  const color = colors[id.charCodeAt(0) % colors.length];

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`h-8 w-8 rounded-full ${color} flex items-center justify-center text-white font-medium text-xs`}
      title={`User ${id.slice(0, 4)}`}
    >
      {id.slice(0, 2).toUpperCase()}
    </motion.div>
  );
}