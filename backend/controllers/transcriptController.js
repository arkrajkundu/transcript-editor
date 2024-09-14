const transcriptData = [
  { id: 1, word: "Hello", start_time: 0, duration: 500 },
  { id: 2, word: "world", start_time: 500, duration: 700 },
  { id: 3, word: "This", start_time: 1200, duration: 300 },
  { id: 4, word: "is", start_time: 1500, duration: 200 },
  { id: 5, word: "a", start_time: 1700, duration: 100 },
  { id: 6, word: "test", start_time: 1800, duration: 400 },
  { id: 7, word: "transcript", start_time: 2200, duration: 600 },
  { id: 8, word: "for", start_time: 2800, duration: 200 },
  { id: 9, word: "playback", start_time: 3000, duration: 500 },
  { id: 10, word: "and", start_time: 3500, duration: 250 },
  { id: 11, word: "editing", start_time: 3750, duration: 800 },
  { id: 12, word: "features.", start_time: 4550, duration: 650 }
];

// Get transcript data
const getTranscript = (req, res) => {
  res.json(transcriptData);
};

// Update a word in the transcript
const updateTranscript = (req, res) => {
  const { id, newWord } = req.body;
  const index = transcriptData.findIndex(word => word.id === id);

  if (index !== -1) {
    transcriptData[index].word = newWord;
    res.json({ success: true, updatedWord: transcriptData[index] });
  } else {
    res.status(404).json({ success: false, message: "Word not found" });
  }
};

module.exports = { getTranscript, updateTranscript };
