const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    topic: {
      type: String,
      required: [true, 'Topic/Category is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Note content is required']
    },
    keywords: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Search indexing for fast title, subject, topic, content search
noteSchema.index({ title: 'text', subject: 'text', topic: 'text', content: 'text' });

module.exports = mongoose.model('Note', noteSchema);
