import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-neutral-800/90 backdrop-blur-md shadow-md text-white">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold text-purple-400">MindJournal</h1>
        <div className="flex space-x-6">
          <Link
            to="/home"
            className="text-neutral-100 hover:text-purple-400 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/journal"
            className="text-neutral-100 hover:text-purple-400 transition-colors"
          >
            Journal
          </Link>
          <Link
            to="/about"
            className="text-neutral-100 hover:text-purple-400 transition-colors"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
