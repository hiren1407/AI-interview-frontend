// src/components/TopicSelection.js
import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";

const TOPICS = [
  "Frontend Development",
  "Behavioral Questions",
  "System Design",
  "Data Structures & Algorithms",
  "DevOps",
  "Cloud Computing",
  "Full Stack Development",
  "Backend  Development",
  "Data Science",
  "Data Analytics"
];

const TopicSelection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.stream) {
      window.stream.getTracks().forEach(track => track.stop());
      window.stream = null;
    }
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Voice Interview Bot</h1>
      <p className="mb-10 text-xl">Select a topic to begin your voice-based interview practice:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TOPICS.map((topic) => (
          <div
            key={topic}
            onClick={() => navigate(`/interview/${topic}`)}
            className="mt-3 cursor-pointer border rounded-xl p-6 bg-white shadow hover:bg-blue-100 transition"
          >
            <h2 className="text-xl font-semibold">{topic}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicSelection;
