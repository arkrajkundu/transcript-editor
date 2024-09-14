const mongoose = require('mongoose');

const transcriptSchema = new mongoose.Schema({
  word: String,
  start_time: Number,
  duration: Number,
});

module.exports = mongoose.model('Transcript', transcriptSchema);
