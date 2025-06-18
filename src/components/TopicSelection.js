import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { API_URL } from "../constants";
import { v4 as uuidv4 } from "uuid";

Modal.setAppElement("#root");

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
  "Data Analytics",
  "Machine Learning",
  "Resume Based Questions",
];

const TopicSelection = () => {
    const sessionId = React.useRef(uuidv4());
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    if (window.stream) {
      window.stream.getTracks().forEach((track) => track.stop());
      window.stream = null;
    }
  }, []);

  const handleTopicClick = (topic) => {
    if (topic === "Resume Based Questions") {
      setShowModal(true);
    } else {
      navigate(`/interview/${topic}`);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", resumeFile);
    formData.append("session_id", sessionId.current);

    const response = await fetch(`${API_URL}/upload-resume`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      navigate(`/interview/${"Resume Based Questions"}`, {
  state: { sessionId: sessionId.current },
});
    } else {
      alert("Failed to upload resume");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Voice Interview Bot</h1>
      <p className="mb-10 text-xl">Select a topic to begin your voice-based interview practice:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TOPICS.map((topic) => (
          <div
            key={topic}
            onClick={() => handleTopicClick(topic)}
            className="mt-3 cursor-pointer border rounded-xl p-6 bg-white shadow hover:bg-blue-100 transition"
          >
            <h2 className="text-xl font-semibold">{topic}</h2>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResumeFile(e.target.files[0])}
          className="mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={() => setShowModal(false)} className="bg-gray-400 px-4 py-2 rounded text-white">Cancel</button>
          <button onClick={handleUpload} className="bg-blue-600 px-4 py-2 rounded text-white">Upload</button>
        </div>
      </Modal>
    </div>
  );
};

export default TopicSelection;
