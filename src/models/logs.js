const mongoose = require('mongoose');

const logsSchema = new mongoose.Schema({
  service: String,
  message: String,
  user: String,
  timestamp: { type: Date, default: Date.now },
  log: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Logs', logsSchema);