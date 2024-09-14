const express = require('express');
const router = express.Router();
const { getTranscript, updateTranscript } = require('../controllers/transcriptController');

// Route to get the transcript data
router.get('/transcript', getTranscript);

// Route to update a transcript word
router.post('/transcript/update', updateTranscript);

module.exports = router;
