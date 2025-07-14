import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';  // LOCALIZACAO DO VIDEO

const App = () => {
  const [videoSrc, setVideoSrc] = useState(null);

  // Função para pegar arquivo local e criar URL para o player
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  return (
    <div className="app-container p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Syncine Player</h1>

      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {videoSrc ? (
        <VideoPlayer videoSrc={videoSrc} />
      ) : (
        <p>Selecione um vídeo para começar a reprodução.</p>
      )}
    </div>
  );
};

export default App;
