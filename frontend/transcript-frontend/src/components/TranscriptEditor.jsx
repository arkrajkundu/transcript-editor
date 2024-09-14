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
      // This updates the word in the transcript array
      await updateTranscript(id, newWord); // Save the change (if you have a backend)
      setTranscript(transcript.map(word => word.id === id ? { ...word, word: newWord } : word)); // Update the transcript
      setEditingWord({ id: null, value: '' }); // Clear the editing state
    } catch (error) {
      console.error("Error updating transcript:", error);
    }
  };

  const handlePlay = () => {
    if (transcript.length === 0) return;
    setIsPlaying(true);
    playTranscript(0);  // Start playing from the first word
  };

  const playTranscript = (index) => {
    if (index >= transcript.length) {
      setIsPlaying(false);  // Stop playing when all words are highlighted
      return;
    }

    const { duration } = transcript[index];
    setCurrentIndex(index);

    setTimeout(() => {
      playTranscript(index + 1);  // Move to the next word after the duration of the current word
    }, duration);
  };

  // Handle word click to show modal
  const handleWordClick = (id, word) => {
    setSelectedWord({ id, word }); // Set the selected word and id
    setEditingWord({ id, value: word }); // Set the word to be edited, but only in the modal
    setShowModal(true); // Show the modal
  };

  // Handle Correct All
  const handleCorrectAll = (newWord) => {
    const updatedTranscript = transcript.map(word =>
      word.word === selectedWord.word ? { ...word, word: newWord } : word
    );
    setTranscript(updatedTranscript); // Update all instances in the transcript
    setShowModal(false); // Close the modal
  };

  // Handle Correct (for one instance)
  const handleCorrect = (newWord) => {
    handleWordChange(selectedWord.id, newWord); // Save the updated word in the transcript
    setShowModal(false); // Close the modal
  };

  // Handle click outside modal to close it
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false); // Close the modal when clicking outside
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Download transcript data as JSON
  const handleDownload = () => {
    const json = JSON.stringify(transcript, null, 2); // Format transcript as JSON with indentation
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.json';
    a.click();

    // Revoke the object URL after the download
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4" style={{ backgroundColor: 'rgba(35,35,35,255)', color: '#FFFFFF', minHeight: '100vh' }}>
      {/* Transcript Editor Heading */}
      <div className="text-center py-4" style={{ backgroundColor: 'rgba(35,35,35,255)', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '24px' }}>
        Transcript Editor
      </div>

      {/* Transcript Words */}
      <div className="transcript-container text-lg text-center mt-4">
        {transcript.map(({ id, word }, index) => (
          <span
            key={id}
            className={`inline-block px-1 cursor-pointer ${index === currentIndex ? 'border' : ''}`}
            style={{
              marginRight: '5px',
              borderRadius: '5px',
              borderColor: index === currentIndex ? 'rgba(225,163,56,255)' : 'transparent',
              color: index === currentIndex ? 'rgba(168,75,71,255)' : '#FFFFFF',  // Change text color when highlighted
              borderWidth: index === currentIndex ? '2px' : '1px',
              display: 'inline-block',
              padding: '2px',
            }}
            onClick={() => handleWordClick(id, word)} // Trigger the modal on word click
          >
            {word} {/* Always show the word from the transcript until it's confirmed */}
          </span>
        ))}
      </div>

      {/* Play and Download Buttons */}
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

      {/* Modal for editing word */}
      {showModal && (
        <div className="relative">
          {/* Overlay to darken the background */}
          <div className="fixed inset-0 bg-black opacity-50 z-40"></div>

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl mb-4">Edit Word</h2>
              <input
                type="text"
                value={editingWord.value}
                onChange={(e) => setEditingWord({ id: selectedWord.id, value: e.target.value })}
                className="border p-2 text-black" // Text inside input should remain black for readability
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
