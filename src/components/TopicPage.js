import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { API_URL } from "../constants";
import { v4 as uuidv4 } from "uuid";
import { topicImages } from "../cardImages";
import { topicStructure } from "../topicStructure"; 
import Breadcrumbs from "./Breadcrumbs"

Modal.setAppElement("#root");



const TopicPage = () => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const topics = topicStructure[category]?.[subcategory] || [];
  
  // Add the new "Resume + JD Based Questions" card
 
  const sessionId = React.useRef(uuidv4());
  const [showModal, setShowModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);


  const handleTopicClick = (topic) => {
   if (topic === "Resume Based Questions" || topic === "Resume + JD Based Questions") {
    setSelectedTopic(topic);
    setShowModal(true);
   }
   else {
      navigate(`/interview/${topic}`);
    }
  };

  const handleUpload = async () => {
  if (!resumeFile) return alert("Please upload a resume.");

  const formData = new FormData();
  formData.append("file", resumeFile);
  formData.append("session_id", sessionId.current);

  // Upload Resume
  const resumeRes = await fetch(`${API_URL}/upload-resume`, {
    method: "POST",
    body: formData,
  });
  const resumeData = await resumeRes.json();

  if (!resumeData.success) {
    return alert("Resume upload failed.");
  }

  // Upload JD if needed
  if (selectedTopic === "Resume + JD Based Questions") {
    if (!jdText.trim()) return alert("Please enter Job Description.");

    const jdForm = new FormData();
    jdForm.append("text", jdText);
    jdForm.append("session_id", sessionId.current);

    const jdRes = await fetch(`${API_URL}/upload-jd`, {
      method: "POST",
      body: jdForm,
    });

    const jdData = await jdRes.json();
    if (!jdData.success) {
      return alert("Job Description upload failed.");
    }
  }

  // Navigate to Interview Page with sessionId
  navigate(`/interview/${selectedTopic}`, {
    state: { sessionId: sessionId.current },
  });
};


  return (
    <div className="p-6 max-w-5xl mx-auto text-center">
      <h2 className="text-3xl font-semibold mb-4">{subcategory} Topics</h2>
     <div className="space-y-6">
       <Breadcrumbs />
  <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
    {topics.map((topic) => (
      <div
        key={topic}
        onClick={() => handleTopicClick(topic)}
        className="cursor-pointer border rounded-3xl p-6 bg-white shadow hover:bg-purple-100 transition flex flex-col items-center space-y-4 min-h-[150px]"
      >
        <img src={topicImages[topic]} alt={topic} className="w-20 h-20" />
        <h3 className="text-lg font-medium">{topic}</h3>
      </div>
    ))}
  </div>

  
</div>

      {/* Resume Modal */}
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

  {selectedTopic === "Resume + JD Based Questions" && (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Paste Job Description</label>
      <textarea
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
        rows={6}
        className="w-full border rounded p-2"
        placeholder="Paste job description here..."
      />
    </div>
  )}

  <div className="flex justify-end space-x-2">
    <button
      onClick={() => setShowModal(false)}
      className="bg-gray-400 px-4 py-2 rounded text-white"
    >
      Cancel
    </button>
    <button
      onClick={handleUpload}
      className="bg-blue-600 px-4 py-2 rounded text-white"
    >
      Upload
    </button>
  </div>
</Modal>

    </div>
  );
};

export default TopicPage;
