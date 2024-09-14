const express = require('express');
const router = express.Router();
const { getTranscript, updateTranscript } = require('../controllers/transcriptController');

router.get('/transcript', getTranscript);
router.post('/transcript/update', updateTranscript);

module.exports = router;
