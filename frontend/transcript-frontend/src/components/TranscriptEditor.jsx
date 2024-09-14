import React, { useEffect, useState, useRef } from 'react';
import { getTranscript, updateTranscript } from '../services/transcriptService';

const TranscriptEditor = () => {
  const [transcript, setTranscript] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1); // To track the current word being highlighted
  const [isPlaying, setIsPlaying] = useState(false); // Playback state
  const [editingWord, setEditingWord] = useState({ id: null, value: '' }); // To track the word being edited
  const [selectedWord, setSelectedWord] = useState(null); // Track the clicked word for the popup
  const [showModal, setShowModal] = useState(false); // Toggle modal visibility
  const modalRef = useRef(null); // Ref to track modal clicks

  useEffect(() => {
    const fetchTranscript = async () => {
      const data = await getTranscript();
      setTranscript(data);
    };
    fetchTranscript();
  }, []);

  const handleWordChange = async (id, newWord) => {
    try {
      await updateTranscript(id, newWord);
      setTranscript(transcript.map(word => word.id === id ? { ...word, word: newWord } : word));
      setEditingWord({ id: null, value: '' });
    } catch (error) {
      console.error("Error updating transcript:", error);
    }
  };

  const handlePlay = () => {
    if (transcript.length === 0) return;
    setIsPlaying(true);
    playTranscript(0);
  };

  const playTranscript = (index) => {
    if (index >= transcript.length) {
      setIsPlaying(false);
      return;
    }

    const { duration } = transcript[index];
    setCurrentIndex(index);

    setTimeout(() => {
      playTranscript(index + 1);
    }, duration);
  };

  const handleWordClick = (id, word) => {
    setSelectedWord({ id, word });
    setEditingWord({ id, value: word });
    setShowModal(true);
  };

  const handleCorrectAll = (newWord) => {
    const updatedTranscript = transcript.map(word =>
      word.word === selectedWord.word ? { ...word, word: newWord } : word
    );
    setTranscript(updatedTranscript);
    setShowModal(false);
  };

  const handleCorrect = (newWord) => {
    handleWordChange(selectedWord.id, newWord);
    setShowModal(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleDownload = () => {
    const json = JSON.stringify(transcript, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.json';
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4" style={{ backgroundColor: 'rgba(35,35,35,255)', color: '#FFFFFF', minHeight: '100vh' }}>
      <div className="text-center py-4" style={{ backgroundColor: 'rgba(35,35,35,255)', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '24px' }}>
        Transcript Editor
      </div>

      <div className="transcript-container text-lg text-center mt-4">
        {transcript.map(({ id, word }, index) => (
          <span
            key={id}
            className={`inline-block px-1 cursor-pointer ${index === currentIndex ? 'border' : ''}`}
            style={{
              marginRight: '5px',
              borderRadius: '5px',
              borderColor: index === currentIndex ? 'rgba(225,163,56,255)' : 'transparent',
              color: index === currentIndex ? 'rgba(168,75,71,255)' : '#FFFFFF',
              borderWidth: index === currentIndex ? '2px' : '1px',
              display: 'inline-block',
              padding: '2px',
            }}
            onClick={() => handleWordClick(id, word)}
          >
            {word}
          </span>
        ))}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className="bg-blue-500 text-white p-2 rounded mb-4 mr-4"
        >
          {isPlaying ? 'Playing...' : 'Play'}
        </button>
        <button
          onClick={handleDownload}
          className="bg-green-500 text-white p-2 rounded mb-4"
        >
          Download
        </button>
      </div>

      {showModal && (
        <div className="relative">
          <div className="fixed inset-0 bg-black opacity-50 z-40"></div>

          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl mb-4">Edit Word</h2>
              <input
                type="text"
                value={editingWord.value}
                onChange={(e) => setEditingWord({ id: selectedWord.id, value: e.target.value })}
                className="border p-2 text-black"
              />
              <div className="mt-4">
                <button onClick={() => handleCorrect(editingWord.value)} className="bg-blue-500 text-white p-2 rounded mr-2">
                  Correct
                </button>
                <button onClick={() => handleCorrectAll(editingWord.value)} className="bg-green-500 text-white p-2 rounded">
                  Correct All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptEditor;
