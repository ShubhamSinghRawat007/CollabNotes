export default function Footer() {
  return (
    <footer className="bg-white border-t py-6">
      <div className="container mx-auto px-4 text-center text-gray-500">
        <p>© {new Date().getFullYear()} CollabNotes. All rights reserved.</p>
        <p className="mt-2 text-sm">
          Built with React, Node.js, MongoDB, and Socket.IO
        </p>
      </div>
    </footer>
  );
}