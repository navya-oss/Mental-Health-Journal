import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import plusIcon from "../assets/plus.png";
import sendIcon from "../assets/send.png";
import voiceIcon from "../assets/voice.png";


function Journal() {
  const [entries, setEntries] = useState([]);
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);
  const [listening, setListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:5000/api/journal/entries";
  const AI_URL = "http://localhost:5000/ai/reply";

  // ✅ Load voices
  const [voices, setVoices] = useState([]);
  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  // ✅ Detect language
  const detectLang = (text) => {
    if (/[\u0C00-\u0C7F]/.test(text)) return "te-IN"; // Telugu
    if (/[\u0900-\u097F]/.test(text)) return "hi-IN"; // Hindi
    if (/[\u0B80-\u0BFF]/.test(text)) return "ta-IN"; // Tamil
    return "en-US";
  };

  // ✅ Speak text (only for voice input)
  const speakText = (text, lang = "en") => {
  if (!window.speechSynthesis) return;

  let utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === "en" ? "en-US" : lang === "hi" ? "hi-IN" : "te-IN";
  utter.rate = 1;
  utter.pitch = 1;
  utter.volume = 1;

  const matchedVoice =
    voices.find((v) => v.lang === utter.lang) ||
    voices.find((v) => v.lang.startsWith(utter.lang.split("-")[0])) ||
    voices[0];

  if (matchedVoice) utter.voice = matchedVoice;

  window.speechSynthesis.speak(utter);
};


  // ✅ Fetch existing journal entries
  useEffect(() => {
    const fetchEntries = async () => {
      if (!token) return;
      try {
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data.entries)) setEntries(data.entries);
      } catch (err) {
        console.log("Failed to fetch journal entries:", err);
      }
    };
    fetchEntries();
  }, [token]);

  // ✅ Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  // ✅ Save entry
  const saveEntry = async (text, type = "user") => {
    if (!token) return;
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, type }),
      });
    } catch (err) {
      console.log(`Failed to save ${type} entry:`, err);
    }
  };

  // ✅ Get AI reply
  const getAIResponse = async (userText) => {
    try {
      const langCode = detectLang(userText).split("-")[0]; // en / te / hi
      const res = await fetch(AI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userText, language: langCode }),
      });
      const data = await res.json();
      return data.reply || "Sorry, no response.";
    } catch (err) {
      console.error("AI request failed:", err);
      return "Sorry, AI failed to respond.";
    }
  };

  // ✅ Add entry (Text input)
  const addEntry = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    const newEntry = { text: note, date: new Date().toLocaleString(), type: "user" };
    setEntries([...entries, newEntry]);
    setNote("");
    await saveEntry(newEntry.text, "user");

    setIsTyping(true);
    const aiText = await getAIResponse(newEntry.text);
    setIsTyping(false);

    const aiEntry = { text: aiText, date: new Date().toLocaleString(), type: "bot" };
    setEntries((prev) => [...prev, aiEntry]);
    await saveEntry(aiEntry.text, "bot");
  };

  // ✅ Voice input
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported 😞");
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    setListening(true);

  recognition.onresult = async (event) => {
    let transcript = event.results[0][0].transcript;

    // ✅ Detect language of transcript
    let lang = "en-US";
    if (/[\u0C00-\u0C7F]/.test(transcript)) lang = "te-IN"; // Telugu
    else if (/[\u0900-\u097F]/.test(transcript)) lang = "hi-IN"; // Hindi
    else if (/[\u0B80-\u0BFF]/.test(transcript)) lang = "ta"; // Tamil

    recognition.lang = lang; // This ensures recognition restarts in correct lang if needed

    const userEntry = {
      text: transcript,
      date: new Date().toLocaleString(),
      type: "user",
    };
    setEntries((prev) => [...prev, userEntry]);
    await saveEntry(transcript, "user");

    const aiText = await getAIResponse(transcript);
    const aiEntry = {
      text: aiText,
      date: new Date().toLocaleString(),
      type: "bot",
    };
    setEntries((prev) => [...prev, aiEntry]);
    await saveEntry(aiText, "bot");

      // ✅ Speak AI text for voice input
      speakText(aiText, lang);
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.start();
  };

  const handleImageChange = (e) => setImage(e.target.files[0]);

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow relative flex flex-col px-6">
        <div className="flex-grow flex flex-col justify-start max-w-3xl mx-auto w-full space-y-4 mt-6 overflow-y-auto">
          {entries.length === 0 && (
            <p className="text-gray-500 text-center">Start by writing your first entry!</p>
          )}

          {entries.map((entry, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl shadow-md border max-w-[80%] break-words ${
                entry.type === "user"
                  ? "bg-purple-400 border-transparent self-end text-black"
                  : "bg-neutral-900 border-2 border-white text-white self-start"
              }`}
            >
              {entry.text && <p>{entry.text}</p>}
              {entry.image && (
                <img
                  src={entry.image}
                  alt="Journal"
                  className="mt-2 rounded-md max-h-64 object-contain"
                />
              )}
              <span className={`text-xs mt-2 ${entry.type === "user" ? "text-black" : "text-white"}`}>
                {entry.date}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="self-start bg-neutral-900 border-2 border-white text-white p-4 rounded-xl shadow-md max-w-[80%]">
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={addEntry} className="flex items-center justify-center w-full max-w-3xl mx-auto mb-6">
          <div className="relative w-full md:w-[75%]">
            <label className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
              <img src={plusIcon} alt="Add" className="w-6 h-6 object-contain" />
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              placeholder="How are you feeling today?"
              rows={1}
              className="w-full border rounded-full py-3 pl-12 pr-20 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none text-white placeholder-gray-400 overflow-hidden bg-neutral-800"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-3">
              <button
                type="button"
                onClick={startListening}
                className="p-2 rounded-full transition"
                title={listening ? "Stop Voice Input" : "Start Voice Input"}
              >
                <img src={voiceIcon} alt="Voice" className="w-7 h-7 object-contain" />
              </button>
              <button type="submit" className="p-1" title="Send">
                <img src={sendIcon} alt="Send" className="w-6 h-6 object-contain" />
              </button>
            </div>
          </div>
        </form>

        {listening && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
            <div className="relative flex items-center justify-center">
              <img src={voiceIcon} alt="Voice" className="w-24 h-24 object-contain" />
              <span className="absolute inset-0 rounded-full border-4 border-purple-500 animate-ping"></span>
              <div className="absolute -top-20 flex gap-2">
                <span className="w-2 h-5 bg-purple-500 animate-bounce delay-75"></span>
                <span className="w-2 h-8 bg-purple-500 animate-bounce delay-150"></span>
                <span className="w-2 h-12 bg-purple-500 animate-bounce"></span>
                <span className="w-2 h-8 bg-purple-500 animate-bounce delay-150"></span>
                <span className="w-2 h-5 bg-purple-500 animate-bounce delay-75"></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Journal;
