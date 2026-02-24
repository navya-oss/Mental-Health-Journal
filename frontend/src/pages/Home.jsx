import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-6">
        <div className="max-w-2xl bg-neutral-800 rounded-2xl shadow-xl p-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Welcome to MindJournal</h2>
          <p className="text-neutral-300 text-lg leading-relaxed mb-8">
            Track your thoughts, reflect on your feelings, and grow each day. <br />
            <span className="font-semibold text-white">Your mental health matters.</span>
          </p>
          <Link to="/journal">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105">
              Get Started
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
