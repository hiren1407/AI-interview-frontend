// src/components/Interview.js
import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaRobot, FaUser } from "react-icons/fa";
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";
import { API_URL } from "../constants";

Modal.setAppElement("#root");



const Interview = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const hasStarted = useRef(false);
  const chatRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(topic === "Resume Based Questions" ? 15 * 60 : 30 * 60);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const sessionId = useRef(location.state?.sessionId || uuidv4());
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(null);
  const [isStarting, setIsStarting] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);

  const stopSpeaking = () => {
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current = null;
    setIsSpeaking(false);
  }
};

  // Stop mic stream on unmount
  const stopStream = () => {
    if (window.stream) {
      window.stream.getTracks().forEach(track => track.stop());
      window.stream = null;
    }
  };

  useEffect(() => {
    const setupMic = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      window.stream = stream;
    };
    setupMic();

    return () => {
    // Stop speech synthesis when the component unmounts
    

    // Stop the mic stream if it's still active
    stopStream();     // Stop mic
  stopSpeaking(); 
  };
  }, []);

  useEffect(() => {
  if (hasStarted.current) return;
  hasStarted.current = true;

  const startInterview = async () => {
    setIsStarting(true); // show loading

  const response = await fetch(`${API_URL}/respond`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, transcript: "", history: [], session_id: sessionId.current }),
  });

  const data = await response.json();

  if (data.reply) {
    setMessages([{ role: "assistant", text: data.reply }]);

    if (data.audio_base64) {
      const audioBytes = Uint8Array.from(atob(data.audio_base64), c => c.charCodeAt(0));
      const audioBlob = new Blob([audioBytes], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      

            const audio = new Audio(audioUrl);
        audioRef.current = audio;

        setIsSpeaking(true);
        audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
        };

        audio.play().catch(err => {
        console.error("Audio play error:", err);
        setIsSpeaking(false);
        });
    }
  }

  setIsStarting(false); // hide loading after reply
  };

  startInterview();
}, [topic]);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages, isLoading]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowModal(true);
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };


  


  const getResponseFromServer = async (transcript) => {
  const chatHistory = messages.map((m) => ({ role: m.role, content: m.text }));

  setIsLoading(true);
  const response = await fetch(`${API_URL}/respond`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, transcript, history: chatHistory, session_id: sessionId.current }),
  });

  const data = await response.json();
  setIsLoading(false);

  if (data.reply) {
    setMessages(prev => [...prev, { role: "assistant", text: data.reply }]);

    if (data.audio_base64) {
      const audioBytes = Uint8Array.from(atob(data.audio_base64), c => c.charCodeAt(0));
      const audioBlob = new Blob([audioBytes], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
        audioRef.current = audio;

        setIsSpeaking(true);
        audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
        };

        audio.play().catch(err => {
        console.error("Audio play error:", err);
        setIsSpeaking(false);
        });
    }
  }
};


  const transcribeAudio = async (blob) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", blob, "recording.webm");
    formData.append("session_id", sessionId.current);

    const response = await fetch(`${API_URL}/transcribe`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setIsLoading(false);
    if (data.transcript) {
      setMessages(prev => [...prev, { role: "user", text: data.transcript }]);
      getResponseFromServer(data.transcript);
    }
  };

  const startRecording = () => {
    stopSpeaking();
    const mediaRecorder = new MediaRecorder(window.stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      transcribeAudio(blob);
    };

    mediaRecorder.start();
    setIsListening(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const downloadTranscript = () => {
    const content = messages.map((m) => `${m.role.toUpperCase()}: ${m.text}`).join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `interview_${topic.toLowerCase().replace(/\s+/g, "_")}.txt`;
    link.click();
  };

  const getFeedback = async () => {
        const assistantMessages = messages.filter((m) => m.role === "assistant");

        if (assistantMessages.length < 3) {
            setFeedback("Please complete at least 3 interview questions to receive feedback.");
            setScore(null);
            return;
        }
        const chatHistory = messages.map((m) => ({ role: m.role, content: m.text }));
        

            // Stop the mic stream if it's still active
        stopStream();

        const response = await fetch(`${API_URL}/feedback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            topic,
            transcript: "",
            history: chatHistory,
            session_id: sessionId.current,
            }),
        });

        const data = await response.json();
        if (data.feedback && data.score !== undefined) {
            setFeedback(data.feedback);
            setScore(data.score);
        } else {
            setFeedback("Sorry, feedback couldn't be generated.");
            setScore(null);
        }
};


  return (
    
    <div className="p-6  min-h-screen bg-gray-100">
        {isStarting && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-90 flex flex-col items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">Preparing your interview...</p>
        </div>
        )}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">🧠 Topic: {topic}</h1>
        <p className="text-right font-mono text-sm text-gray-600">⏰ Time Left: {formatTime(secondsLeft)}</p>

        <div
          ref={chatRef}
          className="h-[400px] overflow-y-auto space-y-4 p-4 bg-gray-50 rounded border"
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-start space-x-2 max-w-xs px-3 py-2 rounded-lg ${
                msg.role === "user" ? "bg-blue-100 text-right" : "bg-green-100"
              }`}>
                {msg.role === "assistant" && (
                <FaRobot className="mt-1 text-gray-600 flex-shrink-0 text-lg" />
                )}
                <p className="text-sm whitespace-pre-line">{msg.text}</p>
                {msg.role === "user" && (
                <FaUser className="mt-1 text-gray-600 flex-shrink-0 text-lg" />
                )}
              </div>
            </div>
          ))}
          {isListening && (
            <div className="flex justify-end">
                <div className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-lg max-w-xs animate-pulse">
                <div className="h-4 w-16 bg-blue-300 rounded" />
                <FaUser className="text-blue-600 text-lg" />
                </div>
            </div>
            )}

          {isLoading && (
            <div className="flex items-center space-x-2 animate-pulse">
              <FaRobot className="text-gray-500" />
              <div className="h-4 w-40 bg-gray-300 rounded-md" />
            </div>
          )}
          {isSpeaking && (
            <p className="text-sm text-gray-500 animate-pulse">🔊 AI is speaking...</p>
            )}
        </div>

        <div className="flex flex-wrap gap-2 justify-between items-center">
          {!isListening ? (
            <button onClick={startRecording} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              🎤 Start Speaking
            </button>
          ) : (
            <button onClick={stopRecording} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              ⏹️ Stop Recording
            </button>
          )}

          <button
            onClick={downloadTranscript}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            📄 Download Transcript
          </button>

          <button
            onClick={() => {
                stopRecording();
                stopSpeaking();
                navigate("/");
            }}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            🔙 Back to Topics
          </button>
          <button
            onClick={() => {
                stopRecording();
                stopSpeaking();
                setShowModal(true);
                getFeedback();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
            ✅ Complete Interview
            </button>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        contentLabel="Interview Finished"
        className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-semibold mb-4">⏰ Time's Up!</h2>
        {feedback && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="text-lg font-semibold mb-2">📝 AI Feedback</h3>
            {score !== null && (
            <p className="text-sm mb-2">⭐ Score: <span className="font-bold">{score}/10</span></p>
            )}
            <p className="text-sm whitespace-pre-line">{feedback}</p>
        </div>
        )}
        <p className="mb-4">The interview session has ended. You can download the transcript or return to topics.</p>
        <div className="flex gap-2 justify-end">
          <button onClick={downloadTranscript} className="bg-gray-800 text-white px-4 py-2 rounded">
            📄 Download
          </button>
          <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-4 py-2 rounded">
            🔙 Go Back
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Interview;
