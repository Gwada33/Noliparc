"use client"

import { useEffect, useState } from "react";
import "./loading.css";

const Loading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-content">
        <h2>Connexion en cours...</h2>
        <div className="loading-progress">
          <div className="loading-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <p>Votre connexion est en cours de vérification...</p>
      </div>
    </div>
  );
};

export default Loading;
