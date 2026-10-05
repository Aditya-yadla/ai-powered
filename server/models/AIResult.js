const mongoose = require('mongoose');

const aiResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      required: false
    },
    result_type: {
      type: String,
      enum: ['explanation', 'short_summary', 'medium_summary', 'exam_summary'],
      required: true
    },
    result_content: {
      type: String,
      required: true
    },
    source_title: {
      type: String,
      default: 'Custom Input'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('AIResult', aiResultSchema);
