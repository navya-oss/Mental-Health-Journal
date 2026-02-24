import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-6">
        <div className="max-w-2xl bg-neutral-800 rounded-2xl shadow-xl p-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">About MindJournal</h2>
          <p className="text-neutral-300 text-lg leading-relaxed">
            MindJournal is designed to help you track your daily thoughts and emotions.
            Your mental health matters, and journaling is a great way to reflect and grow.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About;
