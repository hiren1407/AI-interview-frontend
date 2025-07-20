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
  
  // Handle Job-Specific Interviews which has no subcategories
  const topics = category === "Job-Specific Interviews" 
    ? topicStructure[category] || []
    : topicStructure[category]?.[subcategory] || [];
  
  // Add the new "Resume + JD Based Questions" card
 
  const sessionId = React.useRef(uuidv4());
  const [showModal, setShowModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isUploading, setIsUploading] = useState(false);


  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setShowModal(true);
  };

  const handleUpload = async () => {
    // Check if this is a Job-Specific Interview topic
    const isJobSpecificTopic = category === "Job-Specific Interviews";
    
    // For Job-Specific Interviews, both resume and JD are mandatory EXCEPT for "Resume Based Questions"
    if (isJobSpecificTopic && selectedTopic !== "Resume Based Questions") {
      if (!resumeFile) return alert("Please upload a resume.");
      if (!jdText.trim()) return alert("Please enter Job Description.");
    }

    // For Resume Based Questions, only resume is required
    if (selectedTopic === "Resume Based Questions" && !resumeFile) {
      return alert("Please upload a resume.");
    }

    // For other topics, if no resume is uploaded, just continue to interview
    if (!resumeFile && !isJobSpecificTopic && selectedTopic !== "Resume Based Questions") {
      navigate(`/interview/${selectedTopic}`);
      return;
    }

    setIsUploading(true);

    try {
      // Upload Resume if provided
      if (resumeFile) {
        const formData = new FormData();
        formData.append("file", resumeFile);
        formData.append("session_id", sessionId.current);

        const resumeRes = await fetch(`${API_URL}/upload-resume`, {
          method: "POST",
          body: formData,
        });
        const resumeData = await resumeRes.json();

        if (!resumeData.success) {
          setIsUploading(false);
          return alert("Resume upload failed.");
        }
      }

      // Upload JD if needed for Job-Specific Interviews (except Resume Based Questions) or Resume + JD Based Questions
      if (((isJobSpecificTopic && selectedTopic !== "Resume Based Questions") || selectedTopic === "Resume + JD Based Questions") && jdText.trim()) {
        const jdForm = new FormData();
        jdForm.append("text", jdText);
        jdForm.append("session_id", sessionId.current);

        const jdRes = await fetch(`${API_URL}/upload-jd`, {
          method: "POST",
          body: jdForm,
        });

        const jdData = await jdRes.json();
        if (!jdData.success) {
          setIsUploading(false);
          return alert("Job Description upload failed.");
        }
      }

      // Add a delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate to Interview Page with sessionId
      navigate(`/interview/${selectedTopic}`, {
        state: { sessionId: sessionId.current },
      });
    } catch (error) {
      setIsUploading(false);
      alert("Upload failed. Please try again.");
    }
  };

const handleSkipUpload = () => {
    // Go directly to interview without uploading resume
    navigate(`/interview/${selectedTopic}`);
  };


  return (
    <div className="p-6 max-w-5xl mx-auto text-center">
      <h2 className="text-3xl font-semibold mb-4">
        {category === "Job-Specific Interviews" ? "Job-Specific Interview Topics" : `${subcategory} Topics`}
      </h2>
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

      {/* Upload Modal */}
      <Modal
  isOpen={showModal}
  onRequestClose={() => !isUploading && setShowModal(false)}
  className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
  overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
>
  {isUploading ? (
    /* Loading Screen */
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h3 className="text-xl font-semibold mb-2">Processing...</h3>
      <p className="text-gray-600">
        {resumeFile ? "Uploading your resume and preparing personalized questions" : "Preparing your interview"}
      </p>
    </div>
  ) : (
    /* Upload Form */
    <>
      <h2 className="text-xl font-semibold mb-4">
        {category === "Job-Specific Interviews" && selectedTopic !== "Resume Based Questions" ? "Upload Resume & Job Description" :
         selectedTopic === "Resume Based Questions" ? "Upload Your Resume" :
         "Upload Resume (Optional)"}
      </h2>
      
      {category === "Job-Specific Interviews" && selectedTopic !== "Resume Based Questions" && (
        <p className="text-sm text-gray-600 mb-4">
          Both resume and job description are required for job-specific interviews.
        </p>
      )}
      
      {selectedTopic === "Resume Based Questions" && (
        <p className="text-sm text-gray-600 mb-4">
          Upload your resume to get personalized questions based on your experience.
        </p>
      )}
      
      {category !== "Job-Specific Interviews" && selectedTopic !== "Resume Based Questions" && (
        <p className="text-sm text-gray-600 mb-4">
          Upload your resume to get personalized questions, or skip to continue with general questions.
        </p>
      )}

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setResumeFile(e.target.files[0])}
        className="mb-4 w-full"
      />

      {((category === "Job-Specific Interviews" && selectedTopic !== "Resume Based Questions") || selectedTopic === "Resume + JD Based Questions") && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Paste Job Description {category === "Job-Specific Interviews" ? "*" : "*"}
          </label>
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
          disabled={isUploading}
          className="bg-gray-400 px-4 py-2 rounded text-white hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        
        {/* Show Skip button only for optional topics (not Job-Specific and not Resume Based Questions) */}
        {category !== "Job-Specific Interviews" && selectedTopic !== "Resume Based Questions" && (
          <button
            onClick={handleSkipUpload}
            disabled={isUploading}
            className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Skip & Continue
          </button>
        )}
        
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {(category === "Job-Specific Interviews" && selectedTopic !== "Resume Based Questions") || selectedTopic === "Resume + JD Based Questions" 
            ? "Upload & Start" 
            : selectedTopic === "Resume Based Questions"
            ? "Upload Resume & Start"
            : resumeFile ? "Upload & Start" : "Start Interview"}
        </button>
      </div>
    </>
  )}
</Modal>

    </div>
  );
};

export default TopicPage;
