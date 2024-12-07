const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  guardianKeys: [{
    guardian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    keySubmitted: {
      type: Boolean,
      default: false
    },
    submittedAt: Date
  }],
  selectedQuestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Exam', examSchema); 